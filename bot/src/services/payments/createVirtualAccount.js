// import dotenv from "dotenv";
import { error } from "node:console";
import { flutterwaveClient } from "./FlutterwaveClient.js";

// dotenv.config();

const createVirtualAccount = async ({ref, customerId, amount}) => {
  if (!ref || !customerId) {
    throw new Error("Missing reference number and/or customer id");
  }

  const body = {
    reference: ref,
    customer_id: customerId,
    expiry: process.env.ACCOUNT_EXPIRY, // 15 minutes in seconds
    amount: 1500,
    bank_code: process.env.BANK_CODE,
    currency: "NGN",
    account_type: process.env.ACCOUNT_TYPE,
    narration: `payment on Swiftride`,
  };

  try {
    const response = await fetch(
      `${process.env.FLW_BASE_URL}/virtual-accounts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${await flutterwaveClient.getToken()}`,
          "X-Idempotency-Key": ref,
        },
        body: JSON.stringify(body),
      },
    );
    if (!response.ok) {
      console.error(
        "Failed to create customer virtual account in Flutterwave:",
        response,
        response.status,
        response.statusText,
      );
      throw new Error(
        "Failed to create customer virtual account in Flutterwave:" +
          response.statusText,
      );
    }

    const data = await response.json();
    console.log("Customer virtual account created in Flutterwave:", data);
    return data; // Return created virtual account object
  } catch (err) {
    console.log(err)
  }
};

export default createVirtualAccount;
