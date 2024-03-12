import { format, isToday, isYesterday } from "date-fns";

export function formatClockedInMessage(date: Date) {
  const currentDate = new Date();

  if (isToday(date)) {
    return `You clocked in at ${format(date, "h:mm a")} today.`;
  } else if (isYesterday(date)) {
    return `You clocked in at ${format(date, "h:mm a")} yesterday.`;
  } else {
    const daysDifference = Math.floor(
      (currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    return `You clocked in at ${format(
      date,
      "h:mm a"
    )} ${daysDifference} days ago.`;
  }
}

export function formatDuration(duration: number) {
  // Calculate hours and minutes
  const hours = Math.floor(duration / (1000 * 60 * 60));
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

  // Format the result
  const formattedDuration = `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;

  return formattedDuration;
}
