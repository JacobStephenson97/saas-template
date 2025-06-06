import { db, user } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {

  if (!process.env.STRIPE_SECRET_KEY) {
    return new Response("Stripe not configured", { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const body = await request.text();
  let event: Stripe.Event | null = null;
  const signature = request.headers.get('stripe-signature');

  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (webhookSecret && request.body && signature) {
    // Get the signature sent by Stripe
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err);
      return new Response("Webhook signature verification failed", { status: 400 });
    }
  }

  switch (event?.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      // console.log(`PaymentIntent ${paymentIntent.id} succeeded`, paymentIntent);

      const userId = paymentIntent.metadata.userId;
      if (!userId) {
        return new Response("User ID not found", { status: 400 });
      }

      const [customer] = await db.select().from(user).where(eq(user.id, userId));

      if (!customer) {
        return new Response("Customer not found", { status: 400 });
      }

      const { credits } = customer;

      const newCredits = credits + paymentIntent.amount / 100;

      const updatedUser = await db.update(user).set({ credits: newCredits }).where(eq(user.id, userId)).returning();

      if (!updatedUser) {
        return new Response("Failed to update user", { status: 400 });
      }

      return new Response("PaymentIntent succeeded", { status: 200 });
    default:
      // console.log(`Unhandled event type ${event?.type}`);
      return new Response("Unhandled event type", { status: 200 });
  }

}