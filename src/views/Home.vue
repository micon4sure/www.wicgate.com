<script setup lang="ts">
import {
  onMounted,
  onBeforeUnmount,
  computed,
  watch,
  nextTick,
  type Component,
  markRaw,
} from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@unhead/vue';
import Navigation from '../components/Navigation.vue';
import SiteFooter from '../components/Footer.vue';
import WidgetDashboard from '../components/WidgetDashboard.vue';
import Downloads from '../screens/Downloads.vue';
import Statistics from '../screens/Statistics.vue';
import Community from '../screens/Community.vue';
import FAQ from '../screens/FAQ.vue';
import FirstVisitOverlay from '../components/FirstVisitOverlay.vue';
import { useAppDataStore } from '../stores/appDataStore';
import { useFirstVisit } from '../composables/useFirstVisit';
import { useActiveSection } from '../composables/useActiveSection';
import { useViewportMode } from '../composables/useViewportMode';
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
import { getAllValidIds } from '../types/navigation';
import { syncHeaderHeight } from '../utils/headerHeight';
import { DEFAULT_OG_IMAGE, DEFAULT_SITE_URL } from '../content/pageMeta';

const store = useAppDataStore();
const { showFirstVisitOverlay, initFirstVisitCheck, dismissOverlay } = useFirstVisit();
const { isMobileMode } = useViewportMode();

// Get all valid section IDs for scroll tracking
const ALL_VALID_IDS = getAllValidIds();

// Hybrid navigation highlighting: click-based (route) + scroll-based (manual)
const { currentSection, startProgrammaticScroll } = useActiveSection(ALL_VALID_IDS);

const route = useRoute();

// SSG conditional rendering
const isSSR = import.meta.env.SSR;
const targetSection = computed(() => route.meta.section as string | undefined);

// Disable scroll tracking during programmatic navigation (clicks)
watch(
  () => route.meta.section || route.meta.subsection,
  (newSection, oldSection) => {
    // Only trigger on actual navigation (not initial load)
    if (oldSection !== undefined && newSection !== oldSection) {
      startProgrammaticScroll();
    }
  }
);

// Helper to scroll to a section element
function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (!element) return;

  const headerHeight =
    parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--header-height').trim()
    ) || 80;

  const top = element.getBoundingClientRect().top + window.scrollY - headerHeight;
  window.scrollTo({ top, behavior: 'smooth' });
}

// When switching to mobile mode while on a section route, scroll to that section
watch(isMobileMode, (nowMobile) => {
  if (nowMobile && targetSection.value) {
    // Wait for all sections to render, then scroll to current section
    nextTick(() => {
      scrollToSection(targetSection.value as string);
    });
  }
});

// Determine effective path for SEO (subsections use parent section)
const effectiveSeoPath = computed(() => {
  // If this is a subsection route, use parent section path for SEO
  if (route.meta.subsection) {
    // Extract parent path: /downloads/quick → /downloads, /faq/about → /faq
    const pathParts = route.path.split('/').filter(Boolean);
    return pathParts.length > 1 ? `/${pathParts[0]}` : route.path;
  }
  return route.path;
});

const matchedMeta = computed(() => {
  // For subsections, find parent section meta for consolidated SEO
  if (route.meta.subsection) {
    const matched = [...route.matched].reverse();
    // Find the parent route (one without subsection property)
    for (const record of matched) {
      if (record.meta && !record.meta.subsection && Object.keys(record.meta).length > 0) {
        return record.meta;
      }
    }
  }

  // Default: use current route meta
  const matched = [...route.matched].reverse();
  for (const record of matched) {
    if (record.meta && Object.keys(record.meta).length > 0) {
      return record.meta;
    }
  }
  return route.meta;
});

const defaultTitle = 'WICGATE - World in Conflict Multiplayer Revival';
const defaultDescription = 'Play World in Conflict online with restored multiplayer servers.';
const defaultKeywords = 'world in conflict, wic multiplayer, massgate';
const defaultOgImage = `${DEFAULT_SITE_URL}${DEFAULT_OG_IMAGE}`;

const pageTitle = computed(() => (matchedMeta.value.title as string | undefined) || defaultTitle);
const pageDescription = computed(
  () => (matchedMeta.value.description as string | undefined) || defaultDescription
);
const pageKeywords = computed(
  () => (matchedMeta.value.keywords as string | undefined) || defaultKeywords
);
const pageOgImage = computed(
  () => (matchedMeta.value.ogImage as string | undefined) || defaultOgImage
);
const pageRobots = computed(() => matchedMeta.value.robots as string | undefined);

const canonicalUrl = computed(() => {
  // Use effective SEO path (parent for subsections) for canonical URL
  const canonicalPath =
    (matchedMeta.value.canonical as string | undefined) || effectiveSeoPath.value || '/';
  return `https://wicgate.com${
    canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`
  }`;
});

// Determine which sections to render based on SSR vs CSR and viewport
function shouldRenderSection(sectionId: string): boolean {
  // SSR: render only target section (or hero for homepage)
  if (isSSR) {
    if (!targetSection.value) return sectionId === 'hero';
    return targetSection.value === sectionId;
  }

  // CSR Mobile: render all sections for scroll experience
  if (isMobileMode.value) return true;

  // CSR Desktop: render only target section (or hero for homepage)
  if (!targetSection.value) return sectionId === 'hero';
  return targetSection.value === sectionId;
}

// Section component map for KeepAlive dynamic rendering (desktop only)
// markRaw prevents Vue from making components reactive (performance optimization)
const sectionComponents: Record<string, Component> = {
  hero: markRaw(WidgetDashboard),
  community: markRaw(Community),
  statistics: markRaw(Statistics),
  downloads: markRaw(Downloads),
  faq: markRaw(FAQ),
};

// Current section component for desktop KeepAlive rendering
// Returns hero for home page, otherwise the target section
const currentSectionComponent = computed(() => {
  const section = targetSection.value || 'hero';
  return sectionComponents[section] || null;
});

// Props for the current section component
const currentSectionProps = computed(() => {
  const section = targetSection.value || 'hero';
  if (section === 'statistics') {
    return {
      data: store.data,
      loading: store.loading,
      clans: store.clans,
    };
  }
  // Hero and other sections use composables directly, no props needed
  return {};
});

// Whether to use KeepAlive rendering (desktop CSR mode)
// Must stay mounted even on homepage to preserve section cache
const isDesktopCSR = computed(() => {
  return !isSSR && !isMobileMode.value;
});

// Breadcrumb generation for structured data
const breadcrumbs = computed((): BreadcrumbItem[] => {
  const crumbs: BreadcrumbItem[] = [{ name: 'Home', url: 'https://wicgate.com/' }];

  const section = route.meta.section as string | undefined;
  if (section) {
    const sectionNames: Record<string, string> = {
      downloads: 'Downloads',
      statistics: 'Statistics',
      community: 'Community',
      faq: 'FAQ',
    };
    const sectionName = sectionNames[section] || section;
    crumbs.push({
      name: sectionName,
      url: `https://wicgate.com/${section}`,
    });
  }

  return crumbs;
});

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

// Dynamic meta tags based on route
useHead({
  title: pageTitle,
  meta: [
    {
      key: 'description',
      name: 'description',
      content: pageDescription,
    },
    {
      key: 'keywords',
      name: 'keywords',
      content: pageKeywords,
    },
    // Robots meta tag (only if specified)
    ...(pageRobots.value
      ? [
          {
            key: 'robots',
            name: 'robots',
            content: pageRobots.value,
          },
        ]
      : []),
    // Open Graph
    {
      key: 'og:title',
      property: 'og:title',
      content: pageTitle,
    },
    {
      key: 'og:description',
      property: 'og:description',
      content: pageDescription,
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
      content: pageTitle,
    },
    {
      key: 'twitter:description',
      name: 'twitter:description',
      content: pageDescription,
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
  script: [
    // Organization schema for all pages
    {
      type: 'application/ld+json',
      textContent: JSON.stringify(generateOrganizationSchema()),
      key: 'organization-schema',
    },
    // WebSite schema for homepage only
    ...(!targetSection.value
      ? [
          {
            type: 'application/ld+json',
            textContent: JSON.stringify(generateWebSiteSchema()),
            key: 'website-schema',
          },
          // VideoGame schema for homepage
          {
            type: 'application/ld+json',
            textContent: JSON.stringify(generateVideoGameSchema()),
            key: 'videogame-schema',
          },
        ]
      : []),
    // Breadcrumb schema for section pages
    ...(breadcrumbs.value.length > 1
      ? [
          {
            type: 'application/ld+json',
            textContent: JSON.stringify(generateBreadcrumbSchema(breadcrumbs.value)),
            key: 'breadcrumb-schema',
          },
        ]
      : []),
    // WebPage schema for all pages (with ImageObject for OG images)
    {
      type: 'application/ld+json',
      textContent: JSON.stringify(
        generateWebPageSchema(
          effectiveSeoPath.value,
          pageTitle.value,
          pageDescription.value,
          breadcrumbs.value.length > 1
            ? `https://wicgate.com${effectiveSeoPath.value}#breadcrumb`
            : undefined,
          pageOgImage.value // Add OG image for primaryImageOfPage
        )
      ),
      key: 'webpage-schema',
    },
    // SoftwareApplication schema for Downloads page
    ...(targetSection.value === 'downloads'
      ? [
          {
            type: 'application/ld+json',
            textContent: JSON.stringify(generateSoftwareApplicationSchema()),
            key: 'software-schema',
          },
        ]
      : []),
    // HowTo schema for Downloads page
    ...(targetSection.value === 'downloads'
      ? [
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
        ]
      : []),
  ],
});

onMounted(() => {
  // Skip client-side initialization during SSG
  if (isSSR) return;

  // Sync header height with CSS variable for pixel-perfect scroll positioning
  // This measures actual rendered header height and updates --header-height
  const cleanupHeaderSync = syncHeaderHeight();

  // Check for first visit and show overlay if needed
  initFirstVisitCheck();

  // Cleanup on unmount
  onBeforeUnmount(() => {
    // Clean up header height sync
    if (cleanupHeaderSync) cleanupHeaderSync();
  });
});

// First visit overlay handlers
function handleGoHome() {
  dismissOverlay();
  // Browser handles smooth scroll to top via native behavior
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleContinue() {
  dismissOverlay();
  // Browser already scrolled to target section via router scrollBehavior
}
</script>
<template>
  <div id="siteWrapper" class="site-wrapper">
    <header>
      <Navigation :active-section="currentSection" />
    </header>

    <div class="main-content">
      <div id="screens">
        <!-- Desktop CSR: KeepAlive stays mounted to preserve section cache -->
        <KeepAlive v-if="isDesktopCSR">
          <component
            :is="currentSectionComponent"
            :key="targetSection || 'hero'"
            v-bind="currentSectionProps"
          />
        </KeepAlive>

        <!-- SSR / Mobile: standard conditional rendering -->
        <template v-if="!isDesktopCSR">
          <WidgetDashboard v-if="shouldRenderSection('hero')" />
          <Community v-if="shouldRenderSection('community')" />
          <Statistics
            v-if="shouldRenderSection('statistics')"
            :data="store.data"
            :loading="store.loading"
            :clans="store.clans"
          />
          <Downloads v-if="shouldRenderSection('downloads')" />
          <FAQ v-if="shouldRenderSection('faq')" />
        </template>
      </div>
      <SiteFooter />
    </div>
  </div>

  <!-- First Visit Overlay -->
  <FirstVisitOverlay
    v-if="showFirstVisitOverlay"
    :current-section="currentSection"
    @go-home="handleGoHome"
    @continue="handleContinue"
    @close="dismissOverlay"
  />
</template>
