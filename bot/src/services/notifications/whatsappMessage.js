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
    console.log(process.env.TWILIO_OUTBOUND_URL)
    if(!to || !message) {
        console.log("Missing paramenters");
        return;
    }
    const username = process.env.TWILIO_ACCOUNT_SID;
    const password = process.env.TWILIO_AUTH_TOKEN;
    const encodedCredentials = btoa(`${username}:${password}`);
    let recepientNumber = `whatsapp:${to}`
    let data = {
        From: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        To: recepientNumber,
        Body: message 
    };
    try {
        const response = await fetch(process.env.TWILIO_OUTBOUND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization' : `Basic ${encodedCredentials}`
            },
            body: new URLSearchParams(data)
        })

        if(!response.ok) {
            console.log(response)
            throw new Error("Failed to send Whatsapp Message: " + response)
        }

        const result = await response.json()
        console.log(result);
    } catch (err) {
        console.log(err)
    }
}


export default whatsappMessage;