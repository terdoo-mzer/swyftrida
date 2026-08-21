import { Router } from "express";
import { prisma } from "../config/db.js";
import { isFlutterwaveSignatureValid } from "./validateWebhook.js";
import { confirmPayment } from "../services/payments/confirmPayment.js";

const router = Router();

router.post("/", async (req, res) => {
  const signature = req.headers["flutterwave-signature"];
  const isValid = isFlutterwaveSignatureValid(
    req.rawBody,
    signature,
    process.env.FLW_WEBHOOK_SECRET_HASH,
  );

  // Invalid signature
  if (!isValid) return res.sendStatus(401);

  // acknowledge
  res.sendStatus(200);

  const { webhook_id, data } = req.body;

  try {
    const alreadyProcessedWebhook = await prisma.payment_events.findFirst({
      where: { external_event_id: webhook_id },
    });

    if (alreadyProcessedWebhook && alreadyProcessedWebhook.status === data.status) return;

    // Get booking and extract booking id to pass to the webhook log
    const booking = await prisma.bookings.findUnique({
        where: { payment_ref: data.reference}
    })

    if(!booking) {
        console.error('Webhook reference matched no booking:', data.reference);
        return; // Likely a malformed webhook, hence nothing to attach a payment_events row to — log to console only
    }

    // log the actual webhook here
    await prisma.payment_events.create({
      data: {
        booking_id: booking.id,
        type: "webhook_received",
        status: data.status,
        payload: req.body,
        external_event_id: webhook_id,
        created_at: new Date()
      },
    });

    // verify payment and possibly give value to customer
    await confirmPayment(booking)
  } catch (err) {
    console.error(err)
  }

});

export default router;
