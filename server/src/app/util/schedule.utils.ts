/**
 * Calculates endTime by adding 2 hours to startTime ("HH:mm" format).
 * Returns endTime in "HH:mm" 24hr format.
 */
export function calculateEndTime(startTime: string): string {
  const [hour, minute] = startTime.split(":").map(Number);
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  date.setHours(date.getHours() + 2);
  const endHour = date.getHours().toString().padStart(2, "0");
  const endMinute = date.getMinutes().toString().padStart(2, "0");
  return `${endHour}:${endMinute}`;
}