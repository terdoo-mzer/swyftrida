import { prisma } from '../../config/db.js'
import createCustomer from "./createCustomer.js";
import createVirtualAccount from "./createVirtualAccount.js";
import whatsappMessage from "../notifications/whatsappMessage.js";
import { formatPrice } from '../../utils/helpers.js'

const initiatePayment = async ({bookingRef, amount, customer}) => {
  try {
    let flwCustomerId = customer.payment_customer_id;
    
    // The customer has not been created before
    if (!flwCustomerId) {
      const flwCustomer = await createCustomer(customer);
      flwCustomerId = flwCustomer.data.id;
      await prisma.users.update({
        where: { id: customer.id },
        data: { payment_customer_id: flwCustomer.data.id },
      });
    }

    // Create Virtual account for the customer
    const virtualAccount = await createVirtualAccount({
      ref: bookingRef,
      customerId: flwCustomerId,
      amount: amount
    });
    // Call outbound Twilio API to send virtual account details to the customer via Whatsapp

    let message = `Please pay the sum of ${formatPrice(amount)} naira only to the account below:\nAccount number: ${virtualAccount.data.account_number}\n
    Bank Name: ${virtualAccount.data.account_bank_name}\n
    You will be sent a seat reservation ticket after a successful payment.
    Kindly note that this account will be valid only for 30 minutes`;
    whatsappMessage(customer.phone, message);
  } catch (err) {
    console.error(err);
  }
};

export default initiatePayment;
