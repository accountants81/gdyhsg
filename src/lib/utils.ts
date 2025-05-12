import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a placeholder image URL using picsum.photos.
 * @param baseName - A base name for the seed to try and get consistent images for the same baseName.
 * @param width - The width of the placeholder image.
 * @param height - The height of the placeholder image.
 * @returns A string URL for a placeholder image.
 */
export const generatePlaceholderUrl = (baseName: string = "placeholder", width: number = 400, height: number = 400): string => {
  // Using a combination of baseName, current time, and random string for somewhat unique seeds
  // while trying to maintain some consistency if baseName is reused quickly.
  const seed = `${baseName}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
};
