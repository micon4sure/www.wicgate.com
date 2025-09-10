<script setup lang="ts">
import { faq } from '../content/content';
import { ref } from 'vue';
const open = ref<string | null>(null);
function toggle(q:string){open.value = open.value===q ? null : q;}
</script>
<template>
  <section id="faq" class="faq-bg sec">
    <div class="c">
      <div class="tc mb6"><h2>Frequently Asked Questions</h2><p style="font-size:1.125rem;color:var(--t2);max-width:600px;margin:0 auto">Common questions about WICGATE and World in Conflict multiplayer</p></div>
      <div class="faq-cont">
        <div v-for="cat in faq" :key="cat.cat" class="faq-cat">
          <h3>{{ cat.cat }}</h3>
          <div v-for="item in cat.items" :key="item.q" class="faq-item">
            <div class="faq-q" :class="{active: open===item.q}" @click="toggle(item.q)"><h4>{{ item.q }}</h4><span class="chev">▼</span></div>
            <div class="faq-a" :class="{active: open===item.q}"><p>{{ item.a }}</p></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped></style>
