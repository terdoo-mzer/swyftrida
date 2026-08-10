import { prisma } from '../../config/db.js'
import createCustomer from "./createCustomer.js";
import createVirtualAccount from "./createVirtualAccount.js";
import whatsappMessage from "../notifications/whatsappMessage.js";

// const customerData = {
//     bookingRef: "189a9b33-9c11-425b-9edd-44e49da53e9d",
//     amount: 50,
//     phone: '+2348064901390',
//     name: {
//         first: "Jin",
//         last: "Jin"
//     },
//     email: "jin@example.com"
// }

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

    let message = `Please pay the sum of ${amount} naira only to the account below:\nAccount number: ${virtualAccount.data.account_number}\n
    Bank Name: ${virtualAccount.data.account_bank_name}\n
    You will be sent a seat reservation ticket after a successful payment.
    Kindly note that this account will be valid only for 30 minutes`;
    whatsappMessage(customer.phone, message);
  } catch (err) {
    console.error(err);
  }
};

export default initiatePayment;
