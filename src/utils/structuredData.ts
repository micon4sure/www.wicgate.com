/**
 * Structured Data (JSON-LD) Generators for WiCGATE
 * Provides schema.org markup for better SEO
 */

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
    sameAs: [
      'https://discord.gg/WnxwfMTyBe',
      'https://youtube.com/@wicgate',
      'https://github.com/wicgate',
    ],
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
      url: event.link || 'https://discord.gg/WnxwfMTyBe',
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
      },
    })),
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
 * Converts schema object to JSON-LD script tag string
 * Safe for server-side rendering
 */
export function toJsonLdScript(schema: Record<string, any>): string {
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}
