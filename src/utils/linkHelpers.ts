/**
 * Creates an internal link HTML string for SPA navigation.
 * Used with useInternalLinks composable for client-side routing.
 */
export function createInternalLink(text: string, href: string): string {
  return `<a href="${href}" class="internal-link">${text}</a>`;
}

/**
 * Creates an external link HTML string with proper security attributes.
 * Opens in new tab with noopener noreferrer.
 */
export function createExternalLink(text: string, href: string): string {
  return `<a href="${href}" class="external-link" target="_blank" rel="noopener noreferrer">${text}</a>`;
}

/**
 * Creates a download link HTML string for direct file downloads.
 * Opens in new tab with noopener noreferrer, displays download icon.
 */
export function createDownloadLink(text: string, href: string): string {
  return `<a href="${href}" class="download-link" target="_blank" rel="noopener noreferrer">${text}</a>`;
}
