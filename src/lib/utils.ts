import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names safely using clsx and tailwind-merge.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Capitalizes the first letter of a string.
 */
export function capitalize(text: string): string {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Truncates a string to a given length and appends ellipses.
 */
export function truncate(text: string, len: number = 100): string {
  if (!text || text.length <= len) return text;
  return text.slice(0, len) + "...";
}

/**
 * Generates user name initials.
 * e.g., "John Doe" -> "JD"
 */
export function getInitials(name: string): string {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Formats a date using short notation, e.g. "Jul 11"
 */
export function formatDateShort(date: Date | string): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Formats a date as time ago string (e.g. "2 hours ago").
 */
export function timeAgo(date: Date | string): string {
  const timeMs = new Date(date).getTime();
  if (isNaN(timeMs)) return "some time ago";
  const deltaSeconds = Math.round((Date.now() - timeMs) / 1000);

  // Future dates fallback
  if (deltaSeconds < 0) return "just now";

  const cutoffs = [
    60,
    3600,
    86400,
    86400 * 7,
    86400 * 30,
    86400 * 365,
    Infinity,
  ];
  const units: Intl.RelativeTimeFormatUnit[] = [
    "second",
    "minute",
    "hour",
    "day",
    "week",
    "month",
    "year",
  ];
  const unitIndex = cutoffs.findIndex((cutoff) => deltaSeconds < cutoff);

  if (unitIndex === 0) return "just now";

  const divisor = unitIndex === 1 ? 1 : cutoffs[unitIndex - 1];
  const value = Math.floor(deltaSeconds / divisor);

  try {
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    return rtf.format(-value, units[unitIndex - 1]);
  } catch (e) {
    // Basic fallback for older platforms
    const unit = units[unitIndex - 1];
    return `${value} ${unit}${value > 1 ? "s" : ""} ago`;
  }
}

/**
 * Generates a random unique ID.
 */
export function generateId(): string {
  return "id_" + Math.random().toString(36).substring(2, 11);
}
