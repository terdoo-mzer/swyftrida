// import dotenv from "dotenv";
import { error } from "node:console";
import { flutterwaveClient } from "./FlutterwaveClient.js";
import { FlutterwavePaymentPipelineError } from "./errors.js";
import { PAYMENT_STEP } from "./constants.js";

// dotenv.config();

const createVirtualAccount = async ({ paymentReference, customerId, amount }) => {

  if (!paymentReference || !customerId) {
    throw new Error(
      "Flutterwave virtual account creation aborted: Missing customer Id and/or booking reference",
      {
        sourceFunction: PAYMENT_STEP.CREATE_VIRTUAL_ACCOUNT,
        isRetryable: false,
      }
    );
  }


  const body = {
    reference: paymentReference,
    customer_id: customerId,
    expiry: process.env.ACCOUNT_EXPIRY, // 15 minutes in seconds
    amount: 1500,
    bank_code: process.env.BANK_CODE,
    currency: "NGN",
    account_type: process.env.ACCOUNT_TYPE,
    narration: `payment on Swiftride`,
  };

  try {
    const response = await fetch(`${process.env.FLW_BASE_URL}/virtual-accounts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${await flutterwaveClient.getToken()}`,
        "X-Idempotency-Key": paymentReference,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    throw new FlutterwavePaymentPipelineError(
      "Flutterwave virtual account creation API request failed",
      {
        isRetryable: true,
        sourceFunction: PAYMENT_STEP.CREATE_VIRTUAL_ACCOUNT,
        cause: err,
      },
    );
  }
};

export default createVirtualAccount;
