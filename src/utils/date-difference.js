import { formatIsoDate } from "./date-format"

export const getDateDifference = (isoStr) => {
    if (!isoStr) return;
    const givenDate = new Date(isoStr);
    const now = new Date();

    // Ensure the given date is in the future
    if (givenDate <= now) {
        return "00 days, 00 hrs, 00 mins";
    }

    // Calculate the time difference in milliseconds
    let timeDifference = givenDate - now;

    // Convert to days, hours, and minutes
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    timeDifference %= (1000 * 60 * 60 * 24);

    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    timeDifference %= (1000 * 60 * 60);

    const minutes = Math.floor(timeDifference / (1000 * 60));

    // Format the result with zero-padding
    const formattedDays = String(days).padStart(2, "0");
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");

    return `${formattedDays} days, ${formattedHours} hrs, ${formattedMinutes} mins`;
}