import Stripe from "stripe";
import prisma from "../../utils/prisma";
import config from "../../config/config";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";

const stripe = new Stripe(config.stripe.secret_key!, {
  apiVersion: "2022-11-15" as any,
  typescript: true,
});

const createPayment = async (bookingId: string) => {
  console.log(bookingId);
  // Fetch booking details from the database using Prisma
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { flat: true },
  });

  if (!booking) {
    throw new APIError(httpStatus.NOT_FOUND, "Booking not found");
  }

  const user = await prisma.user.findUnique({
    where: { id: booking?.userId },
  });

  if (!user) {
    throw new APIError(httpStatus.NOT_FOUND, "User not found");
  }

  // Create a Stripe checkout session for the selected flat booking
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: booking.flat.title },
          unit_amount: booking.flat.rent * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `http://localhost:5000/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `http://localhost:5000/cancel`,
    metadata: {
      bookingId: booking.id,
    },
    customer_email: user.email,
  });

  // Store payment information in the database using Prisma
  const paymentRecord = await prisma.payment.create({
    data: {
      amount: session.amount_total!,
      currency: session.currency || "usd",
      status: session.status!,
      stripeId: session.id,
      userId: booking?.userId,
      bookingId: booking?.id,
    },
  });

  return { paymentRecord, url: session.url };
};

const processWebhook = async (information: any, sig: any) => {
  const event: Stripe.Event = stripe.webhooks.constructEvent(
    information,
    sig!,
    config.stripe.webhook_secret as string
  );

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("Payment successful:", session.id);

      try {
        // Find the booking ID from the session metadata
        const bookingId = session.metadata?.bookingId;

        if (!bookingId) {
          new APIError(
            httpStatus.NOT_FOUND,
            "Booking ID not found in session metadata"
          );
        }

        // Update the booking status to COMPLETED or any relevant status
        const updatedBooking = await prisma.booking.update({
          where: {
            id: bookingId,
          },
          data: {
            status: "BOOKED",
          },
        });

        console.log("Booking record updated:", updatedBooking);
      } catch (error) {
        new APIError(httpStatus.NOT_MODIFIED, "Error updating booking record");
      }
      break;

    // Handle other event types as needed
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};

const getPaymentStatus = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return session;
};

export const paymentServices = {
  createPayment,
  processWebhook,
  getPaymentStatus,
};
