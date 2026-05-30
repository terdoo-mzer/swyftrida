/** 
    Twilio sends the `from` parameter with a string attached to 
    user phone number like so 'whatsapp:+234xxxxxxxxxxx'
    We need the number ONLY, so we pass it through this function
    to strip the string off.
**/
export const stripWhatsAppNumber = (Number) => {
    // Remove the 'whatsapp:' prefix if it exists
    if (Number.startsWith('whatsapp:')) {
        return Number.replace('whatsapp:', '');
    }
    return Number;
}

/**
    Use this function to validate user input where they are required to enter a choice
    e.g Where are you travelling from? 1.Abuja 2.Lagos etc
    The user is expected to ONLY enter 1 or 2 ... depending on the options they are presented with.
    This function validates the response sent in by the user in this cases.
**/
export const validateUserInput = (input, limit) => {
    const numberOutput = parseInt(input);
    if(isNaN(numberOutput) || numberOutput > limit || numberOutput < 1){
        return false;
    }
    return numberOutput;
}