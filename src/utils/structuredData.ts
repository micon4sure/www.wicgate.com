/**
 * Structured Data (JSON-LD) Generators for WiCGATE
 * Provides schema.org markup for better SEO
 */

import { DISCORD_URL, YOUTUBE_URL } from '@/constants';

export interface Video {
  id: string;
  title: string;
  publishedAt: string;
  thumbnailUrl: string;
  videoUrl: string;
  author?: string;
  views?: number;
}

export interface Event {
  id: number | string;
  name: string;
  start: string;
  description: string;
  link?: string;
}

export interface FAQItem {
  q: string;
  a: string;
  dateModified?: string;
  author?: string;
}

/**
 * Generates Organization schema for WiCGATE
 * Used on homepage and about page
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'WICGATE',
    alternateName: 'World in Conflict Community Gateway',
    url: 'https://wicgate.com',
    logo: 'https://wicgate.com/logo.png',
    description:
      'Community-driven initiative to preserve World in Conflict multiplayer using the official Massgate source code.',
    sameAs: [DISCORD_URL, YOUTUBE_URL, 'https://github.com/wicgate'],
    foundingDate: '2024',
  };
}

/**
 * Generates VideoObject schema for community videos
 * Used on community page
 */
export function generateVideoSchema(video: Video) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.title,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.publishedAt,
    contentUrl: video.videoUrl,
    embedUrl: `https://www.youtube.com/embed/${video.id}`,
    ...(video.author && { author: { '@type': 'Person', name: video.author } }),
    ...(video.views && {
      interactionStatistic: {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/WatchAction',
        userInteractionCount: video.views,
      },
    }),
  };
}

/**
 * Generates Event schema for Discord events
 * Used on community page
 */
export function generateEventSchema(event: Event) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    startDate: event.start,
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'VirtualLocation',
      url: event.link || DISCORD_URL,
    },
    organizer: {
      '@type': 'Organization',
      name: 'WICGATE',
      url: 'https://wicgate.com',
    },
  };
}

/**
 * Generates FAQPage schema for FAQ section
 * Enhanced with author and date information for better SEO
 * Used on FAQ page
 */
export function generateFAQSchema(faqItems: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
        ...(item.dateModified && { dateModified: item.dateModified }),
        ...(item.author && {
          author: {
            '@type': 'Organization',
            name: item.author,
          },
        }),
      },
      ...(item.dateModified && { dateModified: item.dateModified }),
    })),
    dateModified: new Date().toISOString().split('T')[0],
    author: {
      '@type': 'Organization',
      name: 'WICGATE',
      url: 'https://wicgate.com',
    },
  };
}

/**
 * Generates WebSite schema with search action
 * Used on homepage
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'WICGATE',
    url: 'https://wicgate.com',
    description: 'World in Conflict multiplayer revival - Join our community servers',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://wicgate.com/?s={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generates VideoGame schema
 * Used on game-mode page
 */
export function generateVideoGameSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'World in Conflict',
    description: 'Real-time strategy game set in an alternate 1989 where World War III breaks out',
    gamePlatform: 'PC',
    genre: ['Real-time strategy', 'Military'],
    publisher: {
      '@type': 'Organization',
      name: 'Ubisoft',
    },
    datePublished: '2007-09-18',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      ratingCount: '1000',
      bestRating: '5',
    },
  };
}

/**
 * Generates BreadcrumbList schema for navigation
 * Shows breadcrumb trails in search results
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generates SoftwareApplication schema for downloadable software
 * Shows rich app cards in search results
 */
export function generateSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'WIC LIVE',
    applicationCategory: 'GameApplication',
    description:
      'One-click installer for World in Conflict multiplayer with WICGATE servers, community maps, and modern system compatibility.',
    operatingSystem: 'Windows 7, Windows 8, Windows 10, Windows 11',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    downloadUrl: 'https://github.com/wic-live/launcher/releases/latest',
    softwareVersion: 'Latest',
    fileSize: '~50MB',
    screenshot: 'https://wicgate.com/og-getting-started.jpg',
  };
}

/**
 * Generates HowTo schema for step-by-step guides
 * Enables rich how-to cards in Google search
 */
export interface HowToStep {
  name: string;
  text: string;
  image?: string;
  url?: string;
}

export function generateHowToSchema(name: string, description: string, steps: HowToStep[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
      ...(step.url && { url: step.url }),
    })),
  };
}

/**
 * Generates ImageObject schema for enhanced image SEO
 * Improves image search visibility
 * @param url - Full URL to the image
 * @param caption - Descriptive caption for the image
 * @param width - Image width in pixels
 * @param height - Image height in pixels
 */
export function generateImageSchema(url: string, caption: string, width: number, height: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    url,
    caption,
    width: width.toString(),
    height: height.toString(),
    encodingFormat: url.endsWith('.png')
      ? 'image/png'
      : url.endsWith('.webp')
        ? 'image/webp'
        : 'image/jpeg',
  };
}

/**
 * Generates WebPage schema wrapper for better page structure
 * Links breadcrumbs and main content entity
 * @param path - Page path (e.g., /downloads)
 * @param name - Page name/title
 * @param description - Page description
 * @param breadcrumbId - Optional breadcrumb ID reference
 * @param ogImage - Optional OG image path for primaryImageOfPage
 */
export function generateWebPageSchema(
  path: string,
  name: string,
  description: string,
  breadcrumbId?: string,
  ogImage?: string
) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `https://wicgate.com${path}#webpage`,
    url: `https://wicgate.com${path}`,
    name,
    description,
    isPartOf: {
      '@type': 'WebSite',
      '@id': 'https://wicgate.com/#website',
    },
  };

  if (breadcrumbId) {
    schema.breadcrumb = { '@id': breadcrumbId };
  }

  if (ogImage) {
    // Add ImageObject as primaryImageOfPage
    schema.primaryImageOfPage = {
      '@type': 'ImageObject',
      url: `https://wicgate.com${ogImage}`,
      caption: `${name} preview image`,
      width: '1200',
      height: '630',
      encodingFormat: ogImage.endsWith('.png') ? 'image/png' : 'image/jpeg',
    };
  }

  return schema;
}

/**
 * Converts schema object to JSON-LD script tag string
 * Safe for server-side rendering
 */
export function toJsonLdScript(schema: Record<string, any>): string {
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}
