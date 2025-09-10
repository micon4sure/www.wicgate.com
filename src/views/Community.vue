<script setup lang="ts">
import { communityCards } from '../content/content';
</script>
<template>
  <section id="community" class="com-hub section">
    <div class="container">
      <div class="text-center mb-xl">
        <h2>Community</h2>
        <p class="section-lead">Join the conversation across all
          platforms</p>
      </div>
      <div class="grid grid-3 mb-xl">
        <div v-for="c in communityCards" :key="c.title" class="card com-card" :class="c.cls">
          <div class="com-card-color-bar" />
          <div class="card-icon">{{ c.icon }}</div>
          <h3>{{ c.title }}</h3>
          <div class="card-stats">
            <div>
              <div class="stat-val">{{ c.members }}</div>
              <div class="stat-lbl">{{ c.stat1 }}</div>
            </div>
            <div>
              <div class="stat-val">{{ c.online }}</div>
              <div class="stat-lbl">{{ c.stat2 }}</div>
            </div>
          </div>
          <p class="card-desc">{{ c.desc }}</p>
          <a :href="c.link" target="_blank" class="card-act">{{ c.action }} <span>→</span></a>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped></style>
