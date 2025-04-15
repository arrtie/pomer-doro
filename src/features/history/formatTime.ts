/** @format */

export default function formatTimeHHMM(date = new Date()) {
  // display the Date instance as HH:MM in 24hr format
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Use 24-hour format
  } satisfies Intl.DateTimeFormatOptions;

  // TODO: use real locale
  const formatter = new Intl.DateTimeFormat("en-US", options);

  // Format the date and return just the time portion
  return formatter.format(date);
}
