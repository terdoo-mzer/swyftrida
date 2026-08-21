import { FlutterwavePaymentPipelineError } from "../payments/errors.js";
import { PAYMENT_STEP } from "../payments/constants.js";
/**
 * Create outbound messaging functionality for whatsapp. This is used to send business-initiated
 * messages to customers e.g Created Virtual account
 * @params
 * @params
 * @params
 * Return
 *
 */

const whatsappMessage = async (to, message) => {
  if (!to || !message) {
     throw new Error(
      "Outbound Whatsapp Message Aborted: Missing recepient number and/or message",
      {
        sourceFunction: PAYMENT_STEP.CREATE_CUSTOMER,
        isRetryable: false,
      },
    );
  }
  const username = process.env.TWILIO_ACCOUNT_SID;
  const password = process.env.TWILIO_AUTH_TOKEN;
  const encodedCredentials = btoa(`${username}:${password}`);
  let recepientNumber = `whatsapp:${to}`;
  let data = {
    From: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
    To: recepientNumber,
    Body: message,
  };
  try {
    const response = await fetch(process.env.TWILIO_OUTBOUND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${encodedCredentials}`,
      },
      body: new URLSearchParams(data),
    });

    if (!response.ok) {
      console.error("Outbound Whatsapp messaging failed:", response);
      throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }

    const result = await response.json();
  } catch (err) {
     throw new FlutterwavePaymentPipelineError(
      "Outbound Whatsapp Message API request failed",
      {
        isRetryable: true,
        sourceFunction: PAYMENT_STEP.SEND_MESSAGE,
        cause: err,
      },
    );
  }
};

export default whatsappMessage;
