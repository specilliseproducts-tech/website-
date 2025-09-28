export async function testPdfAccessibility(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok && response.headers.get('content-type')?.includes('pdf');
  } catch (error) {
    console.error('PDF accessibility test failed:', error);
    return false;
  }
}

export function getPdfDownloadUrl(url: string): string {
  // Ensure the URL has proper parameters for PDF download
  const urlObj = new URL(url);
  
  // Add parameters to force download instead of inline viewing
  urlObj.searchParams.set('fl_attachment', 'true');
  
  return urlObj.toString();
}

export function getAlternativePdfUrl(url: string): string {
  // Try different Cloudinary transformations for PDF access
  const urlObj = new URL(url);
  
  // Remove any existing transformations and add raw format
  urlObj.pathname = urlObj.pathname.replace(/\/[^\/]+\/[^\/]+\/upload/, '/v1_1/dtcaaevst/raw/upload');
  
  return urlObj.toString();
}
