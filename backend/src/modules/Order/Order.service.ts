import stripe from "../../config/stripe";
import config from "../../config/env";
import Stripe from "stripe";
import prisma from "../../config/prisma";
import APIError from "../../utils/APIError";
import { ICheckoutBody } from "./Order.interface";

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
    if (!course) throw new APIError("Course is not exist", 404);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: course.name,
            },
            unit_amount: course.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${config.BASE_URL}/orders/success`,
      cancel_url: `${config.BASE_URL}/orders/success`,
    });
    const order = await prisma.order.create({
      data: {
        courseId: courseId,
        userId: userId,
      },
    });
    const response = {
      session,
      order,
    };
    return response;
  }
}

export default new OrderService();
