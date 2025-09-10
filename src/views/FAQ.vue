<script setup lang="ts">
import { faq } from '../content/content';
import { ref } from 'vue';
const open = ref<string | null>(null);
function toggle(q: string) { open.value = open.value === q ? null : q; }
</script>
<template>
  <section id="faq" class="faq-bg section">
    <div class="container">
      <div class="text-center mb-xl">
        <h2>Frequently Asked Questions</h2>
        <p class="section-lead">Common questions about WICGATE and
          World in Conflict multiplayer</p>
      </div>
      <div class="faq-cont">
        <div v-for="cat in faq" :key="cat.cat" class="faq-cat">
          <h3>{{ cat.cat }}</h3>
          <div v-for="item in cat.items" :key="item.q" class="faq-item">
            <div class="faq-q" :class="{ active: open === item.q }" @click="toggle(item.q)">
              <h4>{{ item.q }}</h4><span class="chev">▼</span>
            </div>
            <div class="faq-a" :class="{ active: open === item.q }">
              <p>{{ item.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped></style>
