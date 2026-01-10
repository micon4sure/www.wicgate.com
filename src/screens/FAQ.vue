<script setup lang="ts">
import { faq } from '../content/content';
import { ANCHOR_HIGHLIGHT_DELAY } from '../constants';
import { ref, computed, watch, nextTick, inject } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@unhead/vue';
import { generateFAQSchema } from '../utils/structuredData';
import { useInternalLinks } from '../composables/useInternalLinks';
import TabContainer from '../components/TabContainer.vue';

const route = useRoute();

// Client-side navigation for internal links in FAQ answers
const { handleContentClick } = useInternalLinks();

const openQuestion = ref<string | null>(null);
const showCopiedToast = ref(false);
const copiedQuestionId = ref<string | null>(null);

// Base path for GitHub Pages deployment (see main.ts)
const appBase = inject<string>('appBase', '/');

function toggleQuestion(q: string) {
  openQuestion.value = openQuestion.value === q ? null : q;
}

// Copy question link to clipboard
function copyQuestionLink(questionId: string) {
  // SSR guard - clipboard API only available in browser
  if (typeof window === 'undefined' || !navigator.clipboard) return;

  // Build URL with question ID, including base path for GitHub Pages
  const url = `${window.location.origin}${appBase}faq#${questionId}`;

  navigator.clipboard
    .writeText(url)
    .then(() => {
      copiedQuestionId.value = questionId;
      showCopiedToast.value = true;

      // Auto-hide toast after 2 seconds
      setTimeout(() => {
        showCopiedToast.value = false;
        setTimeout(() => {
          copiedQuestionId.value = null;
        }, 300); // Wait for fade-out transition
      }, 2000);
    })
    .catch((error: unknown) => {
      // Graceful degradation: log error but don't crash
      console.error('Failed to copy link to clipboard:', error);

      // Still show visual feedback to user (they may need to copy manually)
      copiedQuestionId.value = questionId;
      showCopiedToast.value = true;

      setTimeout(() => {
        showCopiedToast.value = false;
        setTimeout(() => {
          copiedQuestionId.value = null;
        }, 300);
      }, 2000);
    });
}

// Generate tab ID from category name - maps to URL anchors (e.g., #about-wicgate)
function getCategoryId(categoryName: string): string {
  const categoryMap: Record<string, string> = {
    'About WICGATE': 'faq-about-wicgate',
    'Getting Started': 'faq-getting-started',
    'Technical Issues': 'faq-technical-issues',
    'Gameplay & Features': 'faq-gameplay-features',
  };
  return categoryMap[categoryName] || `faq-${categoryName.toLowerCase().replace(/\s+/g, '-')}`;
}

// Get short anchor name for slot (removes 'faq-' prefix)
function getCategoryAnchor(categoryName: string): string {
  return getCategoryId(categoryName).replace('faq-', '');
}

// Get icon for category
function getCategoryIcon(categoryName: string): string {
  const iconMap: Record<string, string> = {
    'About WICGATE': 'fa-solid fa-book',
    'Getting Started': 'fa-solid fa-graduation-cap',
    'Technical Issues': 'fa-solid fa-wrench',
    'Gameplay & Features': 'fa-solid fa-gamepad',
  };
  return iconMap[categoryName] || 'fa-solid fa-question';
}

// Create tabs from FAQ categories
const tabs = computed(() =>
  faq.map((cat) => ({
    id: getCategoryId(cat.cat),
    label: cat.cat,
    icon: getCategoryIcon(cat.cat),
  }))
);

// Map question IDs to their category tab ID for deep linking
const questionToTabId = computed(() => {
  const map: Record<string, string> = {};
  for (const category of faq) {
    const tabId = getCategoryId(category.cat);
    for (const item of category.items) {
      map[item.id] = tabId;
    }
  }
  return map;
});

// External tab control for question deep links
const externalActiveTabId = ref<string | null>(null);

// Watch route hash for question deep links
watch(
  () => route.hash,
  (newHash) => {
    const hash = newHash?.slice(1) || '';
    if (!hash) {
      externalActiveTabId.value = null;
      openQuestion.value = null;
      return;
    }

    // Find which tab contains this question
    const tabId = questionToTabId.value[hash];
    if (tabId) {
      externalActiveTabId.value = tabId;
      // Wait for tab to render, then expand and scroll to question
      nextTick(() => scrollToQuestion(hash));
    }
  },
  { immediate: true }
);

// Flatten all FAQ items for structured data
const allFaqItems = computed(() => {
  return faq.flatMap((category) => category.items);
});

// FAQ Schema for SEO (SSR-compatible via useHead)
const faqSchema = computed(() => generateFAQSchema(allFaqItems.value));

useHead({
  script: [
    {
      type: 'application/ld+json',
      textContent: () => JSON.stringify(faqSchema.value),
      key: 'faq-schema',
    },
  ],
});

// Scroll to question if hash is present in URL
function scrollToQuestion(questionId: string) {
  if (typeof window === 'undefined') return;

  // Wait for DOM to update
  setTimeout(() => {
    const element = document.getElementById(questionId);
    if (!element) return;

    const headerHeight =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-height').trim()
      ) || 80;
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerHeight - 20; // Extra padding

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });

    // Auto-expand the question
    const questionText = element.querySelector('h4')?.textContent || '';
    if (questionText) {
      openQuestion.value = questionText;
    }

    // Add highlight effect AFTER Vue re-renders from expand (same pattern as Statistics)
    setTimeout(() => {
      element.classList.add('anchor-highlight');
      setTimeout(() => {
        element.classList.remove('anchor-highlight');
      }, 2000);
    }, ANCHOR_HIGHLIGHT_DELAY); // Wait for Vue to finish re-rendering after expand
  }, 300); // Wait for tab content to render
}
</script>

<template>
  <section id="faq" class="section bg-faq-section">
    <div class="container">
      <!-- Header -->
      <div class="text-center mb-12">
        <h2
          class="text-5xl lg:text-6xl font-military font-bold text-t uppercase tracking-wider mb-6"
        >
          Frequently Asked Questions
        </h2>
        <p class="text-lg lg:text-xl text-t-secondary max-w-3xl mx-auto font-body leading-relaxed">
          Common questions about WICGATE and World in Conflict multiplayer
        </p>
      </div>

      <!-- Tab Container -->
      <TabContainer
        :tabs="tabs"
        :external-active-tab-id="externalActiveTabId"
        aria-label="FAQ categories"
      >
        <!-- Tab for each FAQ category -->
        <template v-for="cat in faq" :key="cat.cat" #[getCategoryAnchor(cat.cat)]>
          <div class="py-8 lg:py-10">
            <!-- Questions -->
            <div class="flex flex-col gap-4">
              <div
                v-for="item in cat.items"
                :id="item.id"
                :key="item.q"
                class="faq-question-item faq-item"
                :class="openQuestion === item.q ? 'faq-item-open' : ''"
              >
                <!-- Question Header (Clickable) -->
                <button
                  class="faq-question-header w-full flex items-start gap-4 p-5 lg:p-6 text-left transition-all duration-200 group"
                  @click="toggleQuestion(item.q)"
                >
                  <!-- Question Icon Badge (similar to Downloads numbered badges) -->
                  <span
                    class="step-number-badge-sm transition-all duration-200"
                    :class="openQuestion === item.q ? 'scale-110' : ''"
                  >
                    <i class="fa-solid fa-question text-ink text-sm" aria-hidden="true"></i>
                  </span>

                  <!-- Question text and copy link button -->
                  <div class="flex items-center gap-3 flex-1 min-w-0">
                    <h4
                      class="text-heading font-military font-bold text-t uppercase tracking-wide flex-1 min-w-0"
                    >
                      {{ item.q }}
                    </h4>

                    <!-- Copy Link Button -->
                    <span
                      role="button"
                      tabindex="0"
                      class="faq-copy-link-btn"
                      :class="copiedQuestionId === item.id ? 'is-copied' : ''"
                      :title="`Copy link to this question`"
                      :aria-label="`Copy link to ${item.q}`"
                      @click.stop="copyQuestionLink(item.id)"
                      @keydown.enter.stop.prevent="copyQuestionLink(item.id)"
                      @keydown.space.stop.prevent="copyQuestionLink(item.id)"
                    >
                      <i
                        class="text-sm transition-all duration-200"
                        :class="
                          copiedQuestionId === item.id ? 'fa-solid fa-check' : 'fa-solid fa-link'
                        "
                        aria-hidden="true"
                      ></i>
                    </span>
                  </div>

                  <!-- Chevron Icon -->
                  <div
                    class="text-t-secondary text-lg transition-transform duration-200 flex-shrink-0"
                    :class="openQuestion === item.q ? 'rotate-180' : ''"
                  >
                    <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
                  </div>
                </button>

                <!-- Answer (Collapsible) -->
                <transition
                  enter-active-class="transition-all duration-200 ease-out"
                  leave-active-class="transition-all duration-200 ease-in"
                  enter-from-class="max-h-0 opacity-0"
                  enter-to-class="max-h-[600px] opacity-100"
                  leave-from-class="max-h-[600px] opacity-100"
                  leave-to-class="max-h-0 opacity-0"
                >
                  <div
                    v-show="openQuestion === item.q"
                    class="overflow-hidden border-t border-white/10"
                  >
                    <div class="p-5 lg:p-6 bg-dark-navy-dark/30">
                      <p
                        class="text-data text-t-secondary font-body leading-relaxed m-0"
                        @click="handleContentClick"
                        v-html="item.a"
                      ></p>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </template>
      </TabContainer>

      <!-- Help CTA -->
      <div class="help-cta-box">
        <div class="flex justify-center mb-4">
          <div class="teal-icon-badge">
            <i class="fa-brands fa-discord text-ink text-xl" aria-hidden="true"></i>
          </div>
        </div>
        <h4 class="text-heading font-military font-bold text-t uppercase tracking-wider mb-6">
          Still Have Questions?
        </h4>
        <p class="text-data text-t-secondary font-body leading-relaxed m-0">
          Join our
          <a
            href="https://discord.gg/Udbv9UDBBb"
            target="_blank"
            rel="noopener noreferrer"
            class="external-link"
            >Discord community</a
          >
          for live support and chat with other players!
        </p>
      </div>
    </div>

    <!-- Copy Link Toast Notification -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-300 ease-in"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-show="showCopiedToast"
        class="toast-notification"
        style="top: calc(var(--header-height) + 16px)"
        role="alert"
        aria-live="polite"
      >
        <div class="flex items-center gap-3">
          <i class="fa-solid fa-check text-ink text-lg" aria-hidden="true"></i>
          <span class="text-ink font-body font-semibold">Link copied to clipboard!</span>
        </div>
      </div>
    </transition>
  </section>
</template>
