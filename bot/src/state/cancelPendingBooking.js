import { prisma } from "../config/db.js";

const cancelPendingBooking = async (bookingId) => {
  if (!bookingId) return; // Ensure the function is called with a passed bookingId
  const booking = await prisma.bookings.findUnique({
    where: { id: bookingId },
    select: { seat_id: true },
  });

  if (!booking) return; // nothing to cancel

  // Ensure atomicity here by using `updateMany`. 
  const result = await prisma.bookings.updateMany({
    where: {
      id: bookingId,
      payment_status: "pending",
      booked_at: null,
    },
    data: {
      payment_status: "expired",
    },
  });

  // Only release the seat if WE were the one who actually flipped it —
  // if count is 0, something else - the webhook got there first,
  // and touching the seat here would be wrong.
  if (result.count > 0) {
    await prisma.seats.update({
      where: { id: booking.seat_id },
      data: { status: "available" },
    });
  }
};

export default cancelPendingBooking;