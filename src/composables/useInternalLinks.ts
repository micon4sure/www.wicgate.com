/**
 * Composable for handling internal link clicks in dynamic HTML content.
 *
 * When content is rendered via v-html, anchor tags don't use Vike's router.
 * This composable intercepts clicks on .internal-link elements and routes
 * them through Vike for instant client-side navigation.
 *
 * Industry standard pattern used by Gatsby (catch-links), Nuxt, Next.js
 * for handling internal links in CMS/markdown/dynamic HTML content.
 */
import { navigate } from 'vike/client/router';

export function useInternalLinks() {
  /**
   * Click handler for containers with v-html content containing internal links.
   * Attach to parent element: @click="handleContentClick"
   */
  function handleContentClick(event: MouseEvent) {
    // Find closest .internal-link anchor (handles clicks on nested elements)
    const link = (event.target as HTMLElement).closest('a.internal-link');
    if (!link) return;

    const href = link.getAttribute('href');
    // Skip if no href or external link
    if (!href || href.startsWith('http')) return;

    // Prevent default browser navigation
    event.preventDefault();

    // Strip the router's base path from href if present
    // Links include the base for non-JS fallback, but Vike expects relative paths
    const base = import.meta.env.BASE_URL || '/';
    let routerPath = href;
    if (base !== '/' && href.startsWith(base)) {
      routerPath = href.slice(base.length - 1); // Remove base, keep leading slash
    }

    // Use Vike navigate for client-side navigation
    navigate(routerPath);
  }

  return { handleContentClick };
}
