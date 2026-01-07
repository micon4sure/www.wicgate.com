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

    // Use Vue Router for client-side navigation
    router.push(href);
  }

  return { handleContentClick };
}
