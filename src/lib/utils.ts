import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertSecondsToClock(
  totalSeconds: number,
  withHours?: boolean
): string {
  let hoursString = "";
  if (withHours) {
    const hours = Math.floor(totalSeconds / 3600);
    hoursString = `${hours.toString().padStart(2, "0")}:`;
  }
  totalSeconds %= 3600;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const minutesString = `${minutes.toString().padStart(2, "0")}:`;
  const secondsString = seconds.toString().padStart(2, "0");

  const formattedTime = hoursString + minutesString + secondsString;
  return formattedTime;
}
