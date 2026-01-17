<script setup lang="ts">
import { useHead } from '@unhead/vue';
import Community from '../../screens/Community.vue';
import {
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  generateWebPageSchema,
  type BreadcrumbItem,
} from '../../utils/structuredData';
import { DEFAULT_OG_IMAGE, DEFAULT_SITE_URL, PAGE_META } from '../../content/pageMeta';

const meta = PAGE_META['/community']!;
const ogImage = `${DEFAULT_SITE_URL}${DEFAULT_OG_IMAGE}`;
const canonicalUrl = 'https://wicgate.com/community';

const breadcrumbs: BreadcrumbItem[] = [
  { name: 'Home', url: 'https://wicgate.com/' },
  { name: 'Community', url: canonicalUrl },
];

useHead({
  title: meta.title,
  meta: [
    { key: 'description', name: 'description', content: meta.description },
    { key: 'keywords', name: 'keywords', content: meta.keywords },
    // Open Graph
    { key: 'og:title', property: 'og:title', content: meta.title },
    { key: 'og:description', property: 'og:description', content: meta.description },
    { property: 'og:type', content: 'website' },
    { key: 'og:url', property: 'og:url', content: canonicalUrl },
    { key: 'og:image', property: 'og:image', content: ogImage },
    // Twitter Card
    { key: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
    { key: 'twitter:title', name: 'twitter:title', content: meta.title },
    { key: 'twitter:description', name: 'twitter:description', content: meta.description },
    { key: 'twitter:image', name: 'twitter:image', content: ogImage },
  ],
  link: [{ rel: 'canonical', href: canonicalUrl, key: 'canonical' }],
  script: [
    {
      type: 'application/ld+json',
      textContent: JSON.stringify(generateOrganizationSchema()),
      key: 'organization-schema',
    },
    {
      type: 'application/ld+json',
      textContent: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)),
      key: 'breadcrumb-schema',
    },
    {
      type: 'application/ld+json',
      textContent: JSON.stringify(
        generateWebPageSchema(
          '/community',
          meta.title,
          meta.description,
          `${canonicalUrl}#breadcrumb`,
          ogImage
        )
      ),
      key: 'webpage-schema',
    },
  ],
});
</script>

<template>
  <Community />
</template>
