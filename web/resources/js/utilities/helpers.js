// TODO(): Create date formatter helper function to format dates in a more user friendly way. For example, instead of showing the date like this `2024-06-15T14:30:00.000Z`, we can show it like this `June 15, 2024 at 2:30 PM`
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    return date.toLocaleString('en-US', options);
}

export const formatPrice = (price) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(price);