// import dotenv from "dotenv";
import { error } from "node:console";
import { flutterwaveClient } from "./FlutterwaveClient.js";

// dotenv.config();

const createVirtualAccount = async (customerData) => {
  if (!customerData.ref || !customerData.data.id) {
    throw new Error("Missing reference number and/or customer id");
  }

  const body = {
    reference: customerData.ref,
    customer_id: customerData.data.id,
    expiry: 600, // 15 minutes in seconds
    amount: 1500,
    bank_code: "090567",
    currency: "NGN",
    account_type: "dynamic",
    narration: `payment on Swiftride by ${customerData.data.name.first} ${customerData.data.name.last}`,
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
          "X-Idempotency-Key": customerData.ref,
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
