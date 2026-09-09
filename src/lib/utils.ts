import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uid(prefix = "") {
  const id = Math.random().toString(36).slice(2, 8);
  return prefix ? `${prefix}${id}` : id;
}
