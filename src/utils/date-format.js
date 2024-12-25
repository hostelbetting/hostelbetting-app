export function formatIsoDate(dateString) {
    if (!dateString) return;
    try {
        const dateObject = new Date(dateString);

        // Validate the date object
        if (isNaN(dateObject.getTime())) {
            throw new Error(`Invalid MongoDB date string: ${dateString}`);
        }

        // Month names array
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "June",
            "July", "Aug", "Sept", "Oct", "Nov", "Dec"
        ];

        // Extract day, month, and year
        const day = dateObject.getUTCDate();
        const month = monthNames[dateObject.getUTCMonth()];
        const year = dateObject.getUTCFullYear();
        const dateStr = `${day} ${month} ${year}`;

        // Extract hours and minutes
        const hours = dateObject.getUTCHours();
        const minutes = dateObject.getUTCMinutes();

        // Format hours and minutes
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const timeStr = `${formattedHours}:${formattedMinutes}`;

        return { day, month, year, dateStr, hours: formattedHours, minutes: formattedMinutes, timeStr };
    } catch (error) {
        console.error("Error formatting date:", error.message);
        throw error;
    }
}