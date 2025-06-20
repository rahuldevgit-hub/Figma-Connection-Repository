// lib/utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind and conditional classes.
 * 
 * Usage:
 * cn("p-2", isActive && "bg-blue-500")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
