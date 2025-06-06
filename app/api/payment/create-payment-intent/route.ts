import { getSession } from "@/lib/server";
import Stripe from "stripe";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return new Response("Stripe not configured", { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // $10.00 in cents
      currency: "usd",
      metadata: {
        userId: session.user.id,
      },
    });

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Stripe error:", error);
    return new Response("Payment initialization failed", { status: 500 });
  }
}