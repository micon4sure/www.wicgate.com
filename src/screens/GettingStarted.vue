<script setup lang="ts">
import { steps } from '../content/content';
</script>
<template>
  <section id="getting-started" class="gs-bg section">
    <div class="container">
      <div class="text-center mb-xl">
        <h2>Getting Started</h2>
        <p class="section-lead">
          Join the battlefield in just a few minutes with our streamlined setup
        </p>
      </div>
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

      <div class="note-box">
        <h3 class="grad-text text-center">Need something more advanced?</h3>
        <p class="text-center text-muted">
          Dedicated server hosting and manual installation guides now live in the
          <a href="#faq">Advanced Setup</a>
          section of our FAQ.
        </p>
      </div>
    </div>
  </section>
</template>
<style scoped></style>
