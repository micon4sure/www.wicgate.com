import { computed } from 'vue';
import { useHead, useRoute } from '#imports';
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateBreadcrumbSchema,
  generateSoftwareApplicationSchema,
  generateHowToSchema,
  generateVideoGameSchema,
  generateWebPageSchema,
  type BreadcrumbItem,
  type HowToStep,
} from '../utils/structuredData';
import { DEFAULT_OG_IMAGE, DEFAULT_SITE_URL } from '../content/pageMeta';

export interface PageSeoOptions {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  robots?: string;
  section?: string;
  includeWebsiteSchema?: boolean;
  includeVideoGameSchema?: boolean;
  includeSoftwareSchema?: boolean;
  includeHowToSchema?: boolean;
  howToSteps?: HowToStep[];
  howToTitle?: string;
  howToDescription?: string;
}

export function usePageSeo(options: PageSeoOptions) {
  const route = useRoute();

  const defaultOgImage = `${DEFAULT_SITE_URL}${DEFAULT_OG_IMAGE}`;
  const pageOgImage = options.ogImage || defaultOgImage;

  const canonicalUrl = computed(() => {
    const path = route.path;
    return `https://wicgate.com${path.startsWith('/') ? path : `/${path}`}`;
  });

  // Generate breadcrumbs
  const breadcrumbs = computed((): BreadcrumbItem[] => {
    const crumbs: BreadcrumbItem[] = [{ name: 'Home', url: 'https://wicgate.com/' }];

    if (options.section) {
      const sectionNames: Record<string, string> = {
        downloads: 'Downloads',
        statistics: 'Statistics',
        community: 'Community',
        faq: 'FAQ',
      };
      const sectionName = sectionNames[options.section] || options.section;
      crumbs.push({
        name: sectionName,
        url: `https://wicgate.com/${options.section}`,
      });
    }

    return crumbs;
  });

  // Build schema scripts array
  const schemaScripts = computed(() => {
    const scripts: Array<{ type: string; textContent: string; key: string }> = [];

    // Organization schema for all pages
    scripts.push({
      type: 'application/ld+json',
      textContent: JSON.stringify(generateOrganizationSchema()),
      key: 'organization-schema',
    });

    // WebSite schema (homepage only)
    if (options.includeWebsiteSchema) {
      scripts.push({
        type: 'application/ld+json',
        textContent: JSON.stringify(generateWebSiteSchema()),
        key: 'website-schema',
      });
    }

    // VideoGame schema (homepage only)
    if (options.includeVideoGameSchema) {
      scripts.push({
        type: 'application/ld+json',
        textContent: JSON.stringify(generateVideoGameSchema()),
        key: 'videogame-schema',
      });
    }

    // Breadcrumb schema (section pages)
    if (breadcrumbs.value.length > 1) {
      scripts.push({
        type: 'application/ld+json',
        textContent: JSON.stringify(generateBreadcrumbSchema(breadcrumbs.value)),
        key: 'breadcrumb-schema',
      });
    }

    // WebPage schema
    scripts.push({
      type: 'application/ld+json',
      textContent: JSON.stringify(
        generateWebPageSchema(
          route.path,
          options.title,
          options.description,
          breadcrumbs.value.length > 1 ? `https://wicgate.com${route.path}#breadcrumb` : undefined,
          pageOgImage
        )
      ),
      key: 'webpage-schema',
    });

    // Software schema (downloads page)
    if (options.includeSoftwareSchema) {
      scripts.push({
        type: 'application/ld+json',
        textContent: JSON.stringify(generateSoftwareApplicationSchema()),
        key: 'software-schema',
      });
    }

    // HowTo schema (downloads page)
    if (options.includeHowToSchema && options.howToSteps) {
      scripts.push({
        type: 'application/ld+json',
        textContent: JSON.stringify(
          generateHowToSchema(
            options.howToTitle || 'How to Install',
            options.howToDescription || 'Installation guide',
            options.howToSteps
          )
        ),
        key: 'howto-schema',
      });
    }

    return scripts;
  });

  // Apply head meta
  useHead({
    title: options.title,
    meta: [
      {
        key: 'description',
        name: 'description',
        content: options.description,
      },
      ...(options.keywords
        ? [
            {
              key: 'keywords',
              name: 'keywords',
              content: options.keywords,
            },
          ]
        : []),
      ...(options.robots
        ? [
            {
              key: 'robots',
              name: 'robots',
              content: options.robots,
            },
          ]
        : []),
      // Open Graph
      {
        key: 'og:title',
        property: 'og:title',
        content: options.title,
      },
      {
        key: 'og:description',
        property: 'og:description',
        content: options.description,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        key: 'og:url',
        property: 'og:url',
        content: canonicalUrl,
      },
      {
        key: 'og:image',
        property: 'og:image',
        content: pageOgImage,
      },
      // Twitter Card
      {
        key: 'twitter:card',
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        key: 'twitter:title',
        name: 'twitter:title',
        content: options.title,
      },
      {
        key: 'twitter:description',
        name: 'twitter:description',
        content: options.description,
      },
      {
        key: 'twitter:image',
        name: 'twitter:image',
        content: pageOgImage,
      },
    ],
    link: [
      {
        rel: 'canonical',
        href: canonicalUrl,
        key: 'canonical',
      },
    ],
    script: schemaScripts,
  });

  return {
    canonicalUrl,
    breadcrumbs,
  };
}
