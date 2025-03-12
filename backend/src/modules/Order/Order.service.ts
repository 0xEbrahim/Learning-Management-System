import stripe from "../../config/stripe";
import config from "../../config/env";
import Stripe from "stripe";

class OrderService {
  async createCheckoutSession(Payload: any): Promise<Stripe.Checkout.Session> {
    let course = { name: "", price: 1 };
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
          quantity: Payload.quantity,
        },
      ],
      mode: "payment",
      success_url: `${config.BASE_URL}/orders?success=true`,
      cancel_url: `${config.BASE_URL}/orders?canceled=true`,
    });
    return session;
  }
}

export default new OrderService();
