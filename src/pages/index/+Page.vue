<script setup lang="ts">
import { useHead } from '@unhead/vue';
import WidgetDashboard from '../../components/WidgetDashboard.vue';
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateVideoGameSchema,
  generateWebPageSchema,
} from '../../utils/structuredData';
import { DEFAULT_OG_IMAGE, DEFAULT_SITE_URL, PAGE_META } from '../../content/pageMeta';

const meta = PAGE_META['/']!;
const ogImage = `${DEFAULT_SITE_URL}${DEFAULT_OG_IMAGE}`;
const canonicalUrl = 'https://wicgate.com/';

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
      textContent: JSON.stringify(generateWebSiteSchema()),
      key: 'website-schema',
    },
    {
      type: 'application/ld+json',
      textContent: JSON.stringify(generateVideoGameSchema()),
      key: 'videogame-schema',
    },
    {
      type: 'application/ld+json',
      textContent: JSON.stringify(
        generateWebPageSchema('/', meta.title, meta.description, undefined, ogImage)
      ),
      key: 'webpage-schema',
    },
  ],
});
</script>

<template>
  <WidgetDashboard />
</template>
