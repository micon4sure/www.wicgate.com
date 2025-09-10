<script setup lang="ts">
import { communityCards } from '../content/content';
</script>
<template>
  <section id="community" class="com-hub sec">
    <div class="c">
      <div class="tc mb6"><h2>Community</h2><p style="font-size:1.125rem;color:var(--t2);max-width:600px;margin:0 auto">Join the conversation across all platforms</p></div>
      <div class="g g3 mb6">
        <div v-for="c in communityCards" :key="c.title" class="card com-card" :class="c.cls">
          <div class="com-card-color-bar" />
          <div class="card-icon">{{ c.icon }}</div>
          <h3>{{ c.title }}</h3>
          <div class="card-stats"><div><div class="stat-val">{{ c.members }}</div><div class="stat-lbl">{{ c.stat1 }}</div></div><div><div class="stat-val">{{ c.online }}</div><div class="stat-lbl">{{ c.stat2 }}</div></div></div>
          <p class="card-desc">{{ c.desc }}</p>
          <a :href="c.link" target="_blank" class="card-act">{{ c.action }} <span>→</span></a>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped></style>
