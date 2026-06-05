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

    TODO(Terdoo): Refactor this function to explicitly check if user selected choice is valid 
    compared to the current list. Note that if a user enters a string like `1oxt` parseInt() returns
    `1` as a number, and this is recorded as a valid selection since there may be a choice with 1.
**/
export const validateUserSelection = (selection, listSize) => {
    const selectedNumber = parseInt(selection);
    if(isNaN(selectedNumber) || selectedNumber > listSize || selectedNumber < 1){
        return false;
    }
    return selectedNumber;
}

// TODO(): Create date formatter helper function to format dates in a more user friendly way. For example, instead of showing the date like this `2024-06-15T14:30:00.000Z`, we can show it like this `June 15, 2024 at 2:30 PM`
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    return date.toLocaleString('en-US', options);
}

// 
export const MENU_HINT = '\n\nReply MENU at any time to start over.';