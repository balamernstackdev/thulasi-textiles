import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data, (key, value) => {
    // Check if it's a Prisma Decimal (or any object that looks like one)
    if (value && typeof value === 'object' && value.constructor?.name === 'Decimal') {
      return Number(value);
    }
    return value;
  }));
}
