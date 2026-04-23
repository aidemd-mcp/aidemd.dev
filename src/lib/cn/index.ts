import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merges Tailwind classes without conflicts. Use for all conditional className construction. */
export default function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
