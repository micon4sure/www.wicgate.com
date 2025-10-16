<script setup lang="ts">
import { faq } from '../content/content';
import { ref, computed, onMounted } from 'vue';
import { generateFAQSchema } from '../utils/structuredData';
import TabContainer from '../components/TabContainer.vue';

const openQuestion = ref<string | null>(null);

function toggleQuestion(q: string) {
  openQuestion.value = openQuestion.value === q ? null : q;
}

// Generate subsection ID from category name
function getCategoryId(categoryName: string): string {
  const categoryMap: Record<string, string> = {
    'Getting Started': 'faq-getting-started',
    'Technical Issues': 'faq-technical',
    'Gameplay & Features': 'faq-gameplay',
    'Server & Community': 'faq-server-community',
  };
  return categoryMap[categoryName] || `faq-${categoryName.toLowerCase().replace(/\s+/g, '-')}`;
}

// Get icon for category
function getCategoryIcon(categoryName: string): string {
  const iconMap: Record<string, string> = {
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

// Inject FAQ schema for SEO
onMounted(() => {
  if (import.meta.env.SSR || typeof document === 'undefined') return;

  const existingScript = document.querySelector('script[data-faq-schema]');
  if (existingScript) return; // Already injected

  const schema = generateFAQSchema(allFaqItems.value);
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-faq-schema', 'true');
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
});
</script>

<template>
  <section id="faq" class="section bg-gradient-to-b from-graphite/30 to-graphite-dark/50">
    <div class="container max-w-5xl">
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
        <template v-for="cat in faq" :key="cat.cat" #[getCategoryId(cat.cat)]>
          <div class="p-8 md:p-10">
            <!-- Questions -->
            <div class="flex flex-col gap-4">
              <div
                v-for="item in cat.items"
                :key="item.q"
                class="bg-gradient-to-br from-panel/95 to-panel-dark/98 border-2 border-teal/30 rounded-none overflow-hidden transition-all duration-300"
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

                  <h4
                    class="text-lg md:text-xl font-military font-bold text-t uppercase tracking-wide pr-4"
                  >
                    {{ item.q }}
                  </h4>

                  <!-- Chevron Icon -->
                  <div
                    class="text-teal text-xl transition-transform duration-300 flex-shrink-0"
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
            class="w-12 h-12 rounded-full bg-gradient-to-b from-massgate-orange-light to-massgate-orange border-2 border-massgate-orange flex items-center justify-center"
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
            class="text-teal font-semibold no-underline transition-all duration-200 hover:text-teal-bright hover:underline"
            >Discord community</a
          >
          for live support and chat with other players!
        </p>
      </div>
    </div>
  </section>
</template>
