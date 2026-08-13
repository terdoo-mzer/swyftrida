// import dotenv from "dotenv";
import { prisma } from "../../config/db.js";
import { flutterwaveClient } from "./flutterwaveClient.js";
import { FlutterwavePaymentPipelineError } from "./errors.js";
import { PAYMENT_STEP } from "./constants.js";

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
  if (!customerData || !customerData.email || !customerData.name) {
    throw new Error(
      "Flutterwave Customer creation aborted: Missing Customer data",
      {
        sourceFunction: PAYMENT_STEP.CREATE_CUSTOMER,
        isRetryable: false,
      },
    );
  }
  try {
    const data = {
      name: {
        first: customerData.name,
        last: "NA",
      },
      email: customerData.email,
    };
    // Create User
    const response = await fetch(`${process.env.FLW_BASE_URL}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${await flutterwaveClient.getToken()}`,
        "X-Idempotency-Key": customerData.id,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error(
        "Failed to create customer:",
        response,
      );

      throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Customer created in Flutterwave:", result);
    return result; // Return created customer object
  } catch (err) {
    throw new FlutterwavePaymentPipelineError(
      "Flutterwave Customer creation API request failed",
      {
        isRetryable: true,
        sourceFunction: PAYMENT_STEP.CREATE_CUSTOMER,
        cause: err,
      },
    );
  }
};

export default createCustomer;
