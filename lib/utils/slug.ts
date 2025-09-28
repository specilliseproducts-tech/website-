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
 * Generates a unique slug by checking for duplicates and adding a suffix if needed
 * @param text - The text to convert to a slug
 * @param checkUnique - Function to check if slug exists in database
 * @returns Promise that resolves to a unique slug
 */
export async function generateUniqueSlug(
  text: string,
  checkUnique: (slug: string) => Promise<boolean>
): Promise<string> {
  let baseSlug = generateSlug(text);
  let slug = baseSlug;
  let counter = 1;

  while (!(await checkUnique(slug))) {
    slug = `${baseSlug}-${counter}`;
    counter++;
    
    // Prevent infinite loops
    if (counter > 1000) {
      slug = `${baseSlug}-${Date.now()}`;
      break;
    }
  }

  return slug;
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
