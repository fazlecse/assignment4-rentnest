import { prisma } from "../../lib/prisma";
import config from "../../config";
import { PaymentProvider, PaymentStatus, RentalStatus } from "../../../generated/prisma/enums";
import { stripe } from "../../lib/stripe";

const createCheckoutSession = async (
  tenantId: string,
  rentalRequestId: string,
) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: {
      id: rentalRequestId,
    },
    include: {
      property: true,
      payment: true,
    },
  });

  if (!rentalRequest) {
    throw new Error("Rental request not found");
  }

  // Only owner can pay
  if (rentalRequest.tenantId !== tenantId) {
    throw new Error("You are not authorized to pay for this rental request");
  }

  // Must be approved
  if (rentalRequest.status !== RentalStatus.APPROVED) {
    throw new Error("Rental request is not approved yet");
  }

  // Already paid
  if (
    rentalRequest.payment &&
    rentalRequest.payment.status === PaymentStatus.PAID
  ) {
    throw new Error("Payment already completed");
  }

  const amount = rentalRequest.property.rent * rentalRequest.months;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "bdt",
          unit_amount: Math.round(amount * 100),
          product_data: {
            name: rentalRequest.property.title,
            description: `${rentalRequest.months} Month Rental`,
          },
        },
      },
    ],
    success_url: `${config.app_url}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.app_url}/payment-cancel`,
    metadata: {
      rentalRequestId,
      tenantId,
    },
  });

  if (rentalRequest.payment) {
    await prisma.payment.update({
      where: {
        rentalRequestId,
      },
      data: {
        amount,
        stripeSessionId: session.id,
        provider: PaymentProvider.STRIPE,
        status: PaymentStatus.PENDING,
      },
    });
  } else {
    await prisma.payment.create({
      data: {
        rentalRequestId,
        amount,
        stripeSessionId: session.id,
        provider: PaymentProvider.STRIPE,
        status: PaymentStatus.PENDING,
      },
    });
  }

  return {
    checkoutUrl: session.url,
  };
};

export const paymentService = {
  createCheckoutSession,
};
