<script setup lang="ts">
import { requirements, versions, steps } from '../content/content';
</script>
<template>
  <section id="getting-started" class="gs-bg section">
    <div class="container">
      <div class="text-center mb-xl">
        <h2>Getting Started</h2>
        <p class="section-lead">Join the battlefield in just a few
          minutes with our streamlined setup</p>
      </div>
      <div class="inst-grid">
        <div class="inst-steps">
          <div v-for="s in steps" :key="s.n" class="inst-step">
            <div class="step-num">{{ s.n }}</div>
            <div class="step-cont">
              <h4>{{ s.t }}</h4>
              <!-- Step 2 contains inline HTML (download button); use v-html for all for simplicity -->
              <p v-html="s.c"></p>
            </div>
          </div>
        </div>
        <div class="req">
          <h3 class="grad-text">Requirements</h3>
          <ul>
            <li v-for="r in requirements" :key="r">{{ r }}</li>
          </ul>
          <h3 class="grad-text mt-lg">Supported Versions</h3>
          <ul>
            <li v-for="v in versions" :key="v">{{ v }}</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped></style>
