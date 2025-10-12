<script setup lang="ts">
import { faq } from '../content/content';
import { ref, computed, onMounted } from 'vue';
import { generateFAQSchema } from '../utils/structuredData';

const open = ref<string | null>(null);
function toggle(q: string) {
  open.value = open.value === q ? null : q;
}

// Generate subsection ID from category name
function getCategoryId(categoryName: string): string {
  // Map category names to subsection IDs
  const categoryMap: Record<string, string> = {
    'Getting Started': 'faq-getting-started',
    'Technical Issues': 'faq-technical',
    'Gameplay & Features': 'faq-gameplay',
    'Server & Community': 'faq-server-community',
  };
  return categoryMap[categoryName] || `faq-${categoryName.toLowerCase().replace(/\s+/g, '-')}`;
}

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
  <section id="faq" class="bg-[var(--s1)] section">
    <div class="container">
      <div class="text-center mb-xl">
        <h2>Frequently Asked Questions</h2>
        <p class="section-lead">Common questions about WICGATE and World in Conflict multiplayer</p>
      </div>
      <div class="max-w-[900px] mx-auto">
        <div
          v-for="cat in faq"
          :id="getCategoryId(cat.cat)"
          :key="cat.cat"
          class="mb-10 max-[768px]:mb-[30px] max-[480px]:mb-[25px]"
        >
          <h3
            class="text-[var(--sw)] text-2xl mb-5 pb-2.5 border-b-2 border-[rgba(var(--sw-rgb),0.5)] font-[Oswald,sans-serif] font-bold uppercase tracking-[1.5px] max-[768px]:text-[1.3rem] max-[768px]:mb-[15px] max-[480px]:text-[1.2rem] max-[480px]:mb-3"
          >
            {{ cat.cat }}
          </h3>
          <div
            v-for="item in cat.items"
            :key="item.q"
            class="bg-gradient-to-b from-[rgba(var(--panel-main-rgb),0.94)] to-[rgba(var(--panel-dark-rgb),0.96)] border border-[var(--divider-soft)] shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden mb-[15px] relative hover:border-[rgba(var(--sw-rgb),0.35)] hover:shadow-[0_2px_12px_rgba(0,0,0,0.4)] max-[480px]:mb-2.5"
          >
            <div
              class="py-5 px-[25px] flex justify-between items-center cursor-pointer transition-all relative before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-transparent before:transition-[background] before:duration-300 max-[768px]:py-[15px] max-[768px]:px-5 max-[480px]:py-3 max-[480px]:px-[15px]"
              :class="
                open === item.q
                  ? 'bg-gradient-to-r from-[rgba(var(--sw-rgb),0.12)] to-[rgba(var(--sw-rgb),0.04)] border-b border-[rgba(var(--sw-rgb),0.4)] before:bg-gradient-to-b before:from-[rgba(var(--sw-rgb),0.8)] before:to-[rgba(var(--sw-rgb),0.4)]'
                  : 'hover:bg-gradient-to-r hover:from-[rgba(var(--sw-rgb),0.08)] hover:to-[rgba(var(--sw-rgb),0.02)] hover:text-[var(--t)]'
              "
              @click="toggle(item.q)"
            >
              <h4
                class="text-lg font-semibold m-0 text-[var(--t)] font-[Oswald,sans-serif] uppercase tracking-[0.5px] max-[768px]:text-base max-[480px]:text-[0.95rem] max-[480px]:leading-[1.4]"
              >
                {{ item.q }}
              </h4>
              <span
                class="text-[var(--t2)] transition-all duration-300 flex-shrink-0 ml-[15px] font-semibold text-base opacity-80 select-none max-[768px]:ml-2.5 max-[480px]:ml-2 max-[480px]:text-sm"
                :class="open === item.q ? 'rotate-180 text-[var(--sw)] opacity-100' : ''"
                >▼</span
              >
            </div>
            <div
              class="max-h-0 overflow-hidden transition-[max-height] duration-300"
              :class="open === item.q ? 'max-h-[500px]' : ''"
            >
              <p
                class="py-5 px-[25px] text-[var(--t)] leading-[1.7] relative bg-[rgba(0,0,0,0.12)] font-[Rajdhani,sans-serif] font-medium max-[768px]:py-[15px] max-[768px]:px-5 max-[768px]:text-sm max-[480px]:py-3 max-[480px]:px-[15px] max-[480px]:text-[13px] max-[480px]:leading-relaxed"
              >
                {{ item.a }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped></style>
