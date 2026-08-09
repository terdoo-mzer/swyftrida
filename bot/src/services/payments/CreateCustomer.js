// import dotenv from "dotenv";
import { prisma } from "../../config/db.js";
import { flutterwaveClient } from "./flutterwaveClient.js";

// dotenv.config();
/*
 * TODO: Implement the `createCustomer` function to call Flutterwave's `\customer`
 * endpoint to create a new customer in Flutterwave.
 *
 * @param {Object}
 * @param {Object} name - firstname and lastname of the customer
 * @param {string} email - customer email address
 * Heaader: Authorization: Bearer <access_token>
 * Header: X-Idempotency-Key: <unique_key> - use the created bookings UUID
 * Returns: {Object} - created customer object with a unique customer ID
 *
 */

const createCustomer = async (customerData) => {
  // validate customerData object to ensure it contains the required fields (name and email)
  if (!customerData || !customerData.name || !customerData.email) {
    throw new Error("Invalid customer data. Name and email are required.");
  }

  try {
    // Create User
    const response = await fetch(`${process.env.FLW_BASE_URL}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${await flutterwaveClient.getToken()}`,
        "X-Idempotency-Key": customerData.bookingRef,
      },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      console.error(
        "Failed to create customer in Flutterwave:",
        response,
        response.status,
        response.statusText,
      );
      throw new Error(
        "Failed to create customer in Flutterwave:" + response.statusText,
      );
    }

    const data = await response.json();
    console.log("Customer created in Flutterwave:", data);
    // Update the 'payment_customer_id' column in the 'bookings' table with the returned customer ID
    const updateBookings = await prisma.bookings.update({
      where: { id: customerData.bookingRef },
      data: { payment_customer_id: data.data.id },
    });

    console.log(
      "Updated booking with Flutterwave customer ID:",
      updateBookings,
    );
    return data; // Return created customer object
  } catch (err) {
    console.log(err)
  }
};

export default createCustomer;
