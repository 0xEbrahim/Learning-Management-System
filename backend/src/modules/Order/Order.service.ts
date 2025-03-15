import stringify from "fast-json-stable-stringify";
import stripe from "../../config/stripe";
import config from "../../config/env";
import prisma from "../../config/prisma";
import APIError from "../../utils/APIError";
import {
  ICheckoutBody,
  IGetAllOrders,
  IGetOrderBody,
  IWebhookBody,
} from "./Order.interface";
import { IEmail, IResponse } from "../../Interfaces/types";
import { generateOrderConfirmTemplate } from "../../views/OrderConfirm";
import sendEmail from "../../config/email";
import ApiFeatures from "../../utils/APIFeatures";
import redis from "../../config/redis";

let endpointSecret: any;
endpointSecret = config.STRIPE_WEBHOOK_SECRET as string;
class OrderService {
  async createCheckoutSession(
    Payload: ICheckoutBody
  ): Promise<Record<string, any>> {
    const { courseId, userId } = Payload;

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });
    const customer = await stripe.customers.create({
      metadata: {
        userId: userId,
        cart: JSON.stringify(course),
      },
    });
    if (!course) throw new APIError("Course is not exist", 404);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: customer.id,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: course.name,
              images: [course.thumbnail],
            },
            unit_amount: course.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${config.BASE_URL}/orders/success?q=true`,
      cancel_url: `${config.BASE_URL}/orders/success?q=false`,
    });

    const response = {
      session,
    };
    return response;
  }

  async webhook(Payload: IWebhookBody): Promise<any> {
    const { req } = Payload;
    const payload = req.body;
    const payloadString: string = JSON.stringify(payload, null, 2);
    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret: endpointSecret,
    });
    let event = req.body;
    let data, eventType;
    if (endpointSecret) {
      try {
        event = stripe.webhooks.constructEvent(
          payloadString,
          header,
          endpointSecret
        );
        console.log("Webhook is working");
      } catch (err: any) {
        console.log(`⚠️ Webhook signature verification failed.`, err.message);
        throw new APIError(err.message, 400);
      }
      data = event.data.object;
      eventType = event.type;
    } else {
      data = req.body.data.object;
      eventType = req.body.type;
    }
    let order;
    if (eventType === "checkout.session.completed") {
      const customer: any = await stripe.customers.retrieve(data.customer);
      const course = JSON.parse(customer.metadata.cart);
      order = await prisma.order.findFirst({
        where: {
          courseId: course.id,
          userId: customer.metadata.userId,
        },
      });
      if (order)
        throw new APIError("You have already purchased this course.", 400);
      order = await prisma.order.create({
        data: {
          courseId: course.id,
          userId: customer.metadata.userId,
        },
      });
      const payment = await prisma.payment.create({
        data: {
          orderId: order.id,
          checkout_session: data.id,
          customerId: data.customer,
          email: data.customer_details.email,
          price: data.amount_total,
          status: data.payment_status,
        },
      });
      const email: IEmail = {
        email: data.customer_details.email,
        subject: "Order Confirmation",
        template: generateOrderConfirmTemplate(
          data.customer_details.name,
          course.thumbnail,
          order.id,
          course.name,
          payment.price / 100,
          new Date(Date.now())
        ),
      };
      await sendEmail(email);
    }
    return;
  }

  async getOrder(Payload: IGetOrderBody): Promise<IResponse> {
    const { orderId, userId } = Payload;
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        userId: true,
        id: true,
        course: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });
    if (order?.userId !== userId)
      throw new APIError("You are not eligable to see this order", 401);
    const response: IResponse = {
      status: "Success",
      statusCode: 200,
      data: { order },
    };
    return response;
  }
  async getAllOrders(Payload: IGetAllOrders): Promise<IResponse> {
    const { userId, query: searchQuery, authUser } = Payload;
    let response: IResponse;
    let orders;
    const user = await prisma.user.findUnique({ where: { id: authUser } });
    if (userId) {
      if (userId !== authUser && user?.role !== "ADMIN")
        throw new APIError("You are not eligble to access this.", 401);
      searchQuery.userId = userId;
    } else {
      if (user?.role !== "ADMIN")
        throw new APIError("You are not eligble to access this.", 401);
    }
    const cacheKey = `orders:${stringify(searchQuery)}`;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      response = {
        status: "Success",
        statusCode: 200,
        data: {
          orders: JSON.parse(cachedData),
        },
      };
    }
    const query = new ApiFeatures(prisma, "order", searchQuery)
      .filter()
      .limitFields()
      .sort()
      .paginate();
    // TODO: Fetch more data from the orders
    orders = await query.execute();
    redis.setEx(cacheKey, 3600, JSON.stringify(orders));
    response = {
      status: "Success",
      statusCode: 200,
      data: { orders },
    };
    return response;
  }
}

export default new OrderService();
