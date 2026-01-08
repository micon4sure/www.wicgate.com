/**
 * Composable for handling internal link clicks in dynamic HTML content.
 *
 * When content is rendered via v-html, anchor tags don't use Vue Router.
 * This composable intercepts clicks on .internal-link elements and routes
 * them through Vue Router for instant client-side navigation.
 *
 * Industry standard pattern used by Gatsby (catch-links), Nuxt, Next.js
 * for handling internal links in CMS/markdown/dynamic HTML content.
 */
import { useRouter } from 'vue-router';

export function useInternalLinks() {
  const router = useRouter();

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
    // Links include the base for non-JS fallback, but Vue Router expects relative paths
    const base = import.meta.env.BASE_URL || '/';
    let routerPath = href;
    if (base !== '/' && href.startsWith(base)) {
      routerPath = href.slice(base.length - 1); // Remove base, keep leading slash
    }

    // Use Vue Router for client-side navigation
    router.push(routerPath);
  }

  return { handleContentClick };
}
