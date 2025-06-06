import Stripe from "stripe";
import config from "./env";

const stripe = new Stripe(config.STRIPE_SECRET_KEY as string);

export default stripe;
