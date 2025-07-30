/**
 * Generates a URL-friendly slug from a string
 * @param text - The text to convert to a slug
 * @returns A slugified string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-') // Replace spaces and non-word characters with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading and trailing hyphens
    .substring(0, 50); // Limit length to 50 characters
}

/**
 * Debounced slug generation function
 * @param text - The text to convert to a slug
 * @param delay - Delay in milliseconds (default: 300)
 * @returns Promise that resolves to the slug
 */
export function generateSlugDebounced(
  text: string,
  delay = 300,
): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateSlug(text));
    }, delay);
  });
}
