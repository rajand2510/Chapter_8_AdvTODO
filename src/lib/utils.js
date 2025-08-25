import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// cn() = merge Tailwind + conditional classNames
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
