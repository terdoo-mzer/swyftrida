import { prisma } from "../../config/db.js";
import { flutterwaveClient } from "./flutterwaveClient.js";
export const confirmPayment = async (booking) => {
  const { payment_ref, id, amount_expected, seat_id } = booking;
  try {
    const response = await fetch(
      `${process.env.FLW_BASE_URL}/charges?reference=${payment_ref}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${await flutterwaveClient.getToken()}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error("Payment verification failed");
    }
    const result = await response.json();

    if (!result.data || result.data.length === 0) return;

    if (
      result.data[0].status === "succeeded" &&
      result.data[0].amount === Number(amount_expected) &&
      result.data[0].currency === "NGN" &&
      result.data[0].reference === payment_ref
    ) {
      const bookingsRecord = await prisma.bookings.updateMany({
        where: {
          id: id,
          payment_status: "pending",
        },
        data: {
          amount_paid: result.data[0].amount,
          payment_status: "paid",
          booked_at: new Date(),
        },
      });

      if (bookingsRecord.count > 0) {
        await prisma.seats.update({
          where: {
            id: seat_id,
          },
          data: {
            status: "booked",
          },
        });

        await prisma.payment_events.create({
          data: {
            booking_id: id,
            type: "payment_confirmed",
            status: result.data[0].status,
            payload: {
              charge_id: result.data[0].id,
              amount: result.data[0].amount,
              currency: result.data[0].currency,
              reference: result.data[0].reference,
            },
          },
        });
      }
    } else {
         await prisma.payment_events.create({
          data: {
            booking_id: id,
            type: "payment_mismatch",
            status: result.data[0].status,
            payload: {
              charge_id: result.data[0].id,
              amount: result.data[0].amount,
              currency: result.data[0].currency,
              reference: result.data[0].reference,
            },
          },
        });
    }
  } catch (err) {
    console.error(err);
  }
};
