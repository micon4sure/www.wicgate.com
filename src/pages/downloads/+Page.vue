<script setup lang="ts">
import { useHead } from '@unhead/vue';
import Downloads from '../../screens/Downloads.vue';
import {
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  generateWebPageSchema,
  generateSoftwareApplicationSchema,
  generateHowToSchema,
  type BreadcrumbItem,
  type HowToStep,
} from '../../utils/structuredData';
import { DEFAULT_OG_IMAGE, DEFAULT_SITE_URL, PAGE_META } from '../../content/pageMeta';

const meta = PAGE_META['/downloads']!;
const ogImage = `${DEFAULT_SITE_URL}${DEFAULT_OG_IMAGE}`;
const canonicalUrl = 'https://wicgate.com/downloads';

const breadcrumbs: BreadcrumbItem[] = [
  { name: 'Home', url: 'https://wicgate.com/' },
  { name: 'Downloads', url: canonicalUrl },
];

// HowTo steps for Downloads page
const downloadHowToSteps: HowToStep[] = [
  {
    name: 'Download WIC LIVE Installer',
    text: 'Download the WIC LIVE installer from the official GitHub releases page. This installer handles all setup automatically.',
    url: 'https://github.com/wic-live/launcher/releases/latest',
  },
  {
    name: 'Run the Installer',
    text: 'Run the downloaded installer. WIC LIVE will update your game for WICGATE servers, install community maps, and add quality of life fixes for modern systems.',
  },
  {
    name: 'Launch the Game',
    text: 'After installation, launch World in Conflict and navigate to Multiplayer. You will see WICGATE servers in the server browser.',
  },
  {
    name: 'Join a Server',
    text: 'Select a server from the list and click Join. Create your account when prompted and start playing!',
  },
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
          '/downloads',
          meta.title,
          meta.description,
          `${canonicalUrl}#breadcrumb`,
          ogImage
        )
      ),
      key: 'webpage-schema',
    },
    {
      type: 'application/ld+json',
      textContent: JSON.stringify(generateSoftwareApplicationSchema()),
      key: 'software-schema',
    },
    {
      type: 'application/ld+json',
      textContent: JSON.stringify(
        generateHowToSchema(
          'How to Install World in Conflict Multiplayer',
          'Step-by-step guide to install World in Conflict multiplayer and connect to WICGATE servers using WIC LIVE.',
          downloadHowToSteps
        )
      ),
      key: 'howto-schema',
    },
  ],
});
</script>

<template>
  <Downloads />
</template>
