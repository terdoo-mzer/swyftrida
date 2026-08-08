import createCustomer from "./CreateCustomer.js";
import createVirtualAccount from "./createVirtualAccount.js";
import whatsappMessage from "../notifications/whatsappMessage.js";

const customerData = {
    bookingRef: "189a9b33-9c11-425b-9edd-44e49da53e9d",
    // pass the amount of the booking via the caller
    // pass the customer phone via caller
    // 
    name: {
        first: "Jin",
        last: "Jin"
    },
    email: "jin@example.com"
}

const initiatePayment = async (customerData) => {
    // Create customer in FLutterwave
    const customer = await createCustomer(customerData);
    // Create Virtual account for the customer
    const virtualAccount = await createVirtualAccount({ref: customerData.bookingRef, ...customer});
    // Call outbound Twilio API to send virtual account details to the customer via Whatsapp

    let to = process.env.RECEPIENT_NUMBER
    let message = `Please pay the sum of 500 naira only to the account below:\nAccount number: ${virtualAccount.data.account_number}\n
    Bank Name: ${virtualAccount.data.account_bank_name}\n
    You will be sent a seat reservation ticket after a successful payment.
    Kindly note that this account will be valid only for 30 minutes`
    whatsappMessage(to, message)
}

initiatePayment(customerData);