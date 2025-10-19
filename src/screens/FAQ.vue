<script setup lang="ts">
import { faq } from '../content/content';
import { ref, computed, onMounted } from 'vue';
import { useHead } from '@unhead/vue';
import { generateFAQSchema } from '../utils/structuredData';
import TabContainer from '../components/TabContainer.vue';

const openQuestion = ref<string | null>(null);
const showCopiedToast = ref(false);
const copiedQuestionId = ref<string | null>(null);

function toggleQuestion(q: string) {
  openQuestion.value = openQuestion.value === q ? null : q;
}

// Find which category a question belongs to
function getQuestionCategory(questionId: string): string | null {
  for (const category of faq) {
    const found = category.items.find((item) => item.id === questionId);
    if (found) {
      return getCategoryAnchor(category.cat);
    }
  }
  return null;
}

// Copy question link to clipboard
function copyQuestionLink(questionId: string) {
  // SSR guard - clipboard API only available in browser
  if (typeof window === 'undefined' || !navigator.clipboard) return;

  // Find the category this question belongs to
  const categorySlug = getQuestionCategory(questionId);

  // Build URL with category: /faq/{category}#{questionId}
  const url = categorySlug
    ? `${window.location.origin}/faq/${categorySlug}#${questionId}`
    : `${window.location.origin}/faq#${questionId}`;

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

// Generate subsection ID from category name
function getCategoryId(categoryName: string): string {
  const categoryMap: Record<string, string> = {
    'About WICGATE': 'faq-about',
    'Getting Started': 'faq-getting-started',
    'Technical Issues': 'faq-technical',
    'Gameplay & Features': 'faq-gameplay',
    'Server & Community': 'faq-server',
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
    'Server & Community': 'fa-solid fa-users',
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
  }, 300); // Wait for tab content to render
}

// Handle question deep-linking on mount
onMounted(() => {
  if (typeof window === 'undefined') return;

  const hash = window.location.hash.slice(1); // Remove #
  if (hash) {
    scrollToQuestion(hash);
  }
});
</script>

<template>
  <section id="faq" class="section bg-faq-section">
    <div class="container">
      <!-- Header -->
      <div class="text-center mb-12">
        <h2
          class="text-5xl md:text-6xl font-military font-bold text-t uppercase tracking-wider mb-6"
        >
          Frequently Asked Questions
        </h2>
        <p class="text-lg md:text-xl text-t-secondary max-w-3xl mx-auto font-body leading-relaxed">
          Common questions about WICGATE and World in Conflict multiplayer
        </p>
      </div>

      <!-- Tab Container -->
      <TabContainer :tabs="tabs" analytics-category="FAQ" aria-label="FAQ categories">
        <!-- Tab for each FAQ category -->
        <template v-for="cat in faq" :key="cat.cat" #[getCategoryAnchor(cat.cat)]>
          <div class="py-8 md:py-10">
            <!-- Questions -->
            <div class="flex flex-col gap-4">
              <div
                v-for="item in cat.items"
                :id="item.id"
                :key="item.q"
                class="faq-question-item bg-gradient-to-br from-panel/95 to-panel-dark/98 border-2 border-teal/30 rounded-none overflow-hidden transition-all duration-300"
                :class="
                  openQuestion === item.q
                    ? 'border-teal/60 shadow-teal-subtle'
                    : 'hover:border-teal/50'
                "
              >
                <!-- Question Header (Clickable) -->
                <button
                  class="w-full flex items-center justify-between p-5 md:p-6 text-left transition-all duration-300 relative group"
                  :class="
                    openQuestion === item.q
                      ? 'bg-teal/10 border-b-2 border-teal/40'
                      : 'hover:bg-teal/5'
                  "
                  @click="toggleQuestion(item.q)"
                >
                  <!-- Left border accent -->
                  <div
                    class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b transition-all duration-300"
                    :class="
                      openQuestion === item.q
                        ? 'from-massgate-orange/80 to-massgate-orange/40'
                        : 'from-transparent to-transparent group-hover:from-massgate-orange/50 group-hover:to-massgate-orange/20'
                    "
                  ></div>

                  <!-- Question text and copy link button -->
                  <div class="flex items-center gap-3 flex-1 min-w-0">
                    <h4
                      class="text-lg md:text-xl font-military font-bold text-t uppercase tracking-wide flex-1 min-w-0"
                    >
                      {{ item.q }}
                    </h4>

                    <!-- Copy Link Button -->
                    <span
                      role="button"
                      tabindex="0"
                      class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded transition-all duration-200 opacity-0 group-hover:opacity-100 hover:bg-soviet/20 hover:text-soviet-light focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-soviet/50"
                      :class="
                        copiedQuestionId === item.id
                          ? 'opacity-100 text-soviet-light'
                          : 'text-soviet/70'
                      "
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
                    class="text-teal text-xl transition-transform duration-300 flex-shrink-0 ml-4"
                    :class="openQuestion === item.q ? 'rotate-180' : ''"
                  >
                    <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
                  </div>
                </button>

                <!-- Answer (Collapsible) -->
                <transition
                  enter-active-class="transition-all duration-300 ease-out"
                  leave-active-class="transition-all duration-300 ease-in"
                  enter-from-class="max-h-0 opacity-0"
                  enter-to-class="max-h-[600px] opacity-100"
                  leave-from-class="max-h-[600px] opacity-100"
                  leave-to-class="max-h-0 opacity-0"
                >
                  <div v-show="openQuestion === item.q" class="overflow-hidden">
                    <div class="p-5 md:p-6 bg-graphite-dark/40">
                      <p
                        class="text-base md:text-lg text-t-secondary font-body leading-relaxed m-0"
                      >
                        {{ item.a }}
                      </p>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </template>
      </TabContainer>

      <!-- Help CTA -->
      <div
        class="mt-8 bg-gradient-to-br from-panel/95 to-panel-dark/98 border-2 border-teal/40 rounded-none p-6 md:p-8 text-center"
      >
        <div class="flex justify-center mb-4">
          <div
            class="w-12 h-12 rounded-full bg-gradient-to-b from-teal-bright to-teal-glow border-2 border-teal-darker flex items-center justify-center"
          >
            <i class="fa-brands fa-discord text-ink text-xl" aria-hidden="true"></i>
          </div>
        </div>
        <h4
          class="text-xl md:text-2xl font-military font-bold text-t uppercase tracking-wider mb-4"
        >
          Still Have Questions?
        </h4>
        <p class="text-base md:text-lg text-t-secondary font-body leading-relaxed m-0">
          Join our
          <a
            href="https://discord.gg/WnxwfMTyBe"
            target="_blank"
            rel="noopener noreferrer"
            class="text-soviet font-semibold no-underline transition-all duration-200 hover:text-soviet-light hover:underline"
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
        class="fixed right-6 z-50 bg-gradient-to-br from-teal/95 to-teal-dark/95 backdrop-blur-sm border-2 border-teal-bright/50 rounded px-5 py-3 shadow-lg shadow-teal/30"
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
