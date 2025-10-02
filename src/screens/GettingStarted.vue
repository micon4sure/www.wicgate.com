<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  steps,
  dedicatedServerSteps,
  networkPorts,
  manualInstallSteps,
  manualInstallWarning,
} from '../content/content';

// Advanced Setup expand/collapse state with localStorage persistence
const EXPAND_KEY = 'advanced_setup_expanded';
const stored = typeof window !== 'undefined' ? window.localStorage.getItem(EXPAND_KEY) : null;
const isAdvancedExpanded = ref(stored === '1'); // Default: false (collapsed)

watch(isAdvancedExpanded, (val) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(EXPAND_KEY, val ? '1' : '0');
  }
});
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

      <!-- Advanced Setup Options -->
      <div class="advanced-section">
        <div class="text-center mb-xl">
          <h2>Advanced Setup Options</h2>
          <p class="section-lead">
            For users who need dedicated server hosting or manual installation
          </p>
          <label class="toggle">
            <input v-model="isAdvancedExpanded" type="checkbox" />
            <span class="slider"></span>
            <span class="lbl">{{ isAdvancedExpanded ? 'Collapse' : 'Expand' }}</span>
          </label>
        </div>

        <div v-if="isAdvancedExpanded">
          <!-- Dedicated Server Setup -->
          <div class="server-setup mb-xl">
            <h3 class="grad-text text-center mb-lg">Dedicated Server Setup</h3>
            <p class="text-center mb-lg text-muted">
              To host your own dedicated server, follow these steps:
            </p>

            <div class="inst-grid">
              <div class="inst-steps">
                <div v-for="step in dedicatedServerSteps" :key="step.n" class="inst-step">
                  <div class="step-num">{{ step.n }}</div>
                  <div class="step-cont">
                    <h4>{{ step.t }}</h4>
                    <p v-html="step.c"></p>
                  </div>
                </div>
              </div>
              <div class="server-config">
                <h3 class="grad-text">Network Configuration</h3>
                <p class="mb-md">
                  Ensure your router forwards the following ports to the machine running the server:
                </p>
                <div class="port-list">
                  <div v-for="port in networkPorts" :key="port.port" class="port-item">
                    <span class="port-number">{{ port.port }}</span>
                    <span class="port-protocol">({{ port.protocol }})</span>
                    <p v-if="port.description" class="port-desc">{{ port.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Manual Installation -->
          <div class="manual-install">
            <h3 class="grad-text text-center mb-lg">Manual WICGATE Installation</h3>

            <div class="warning-box mb-lg">
              <div class="warning-icon">
                <i class="fa-solid fa-triangle-exclamation"></i>
              </div>
              <div class="warning-content">
                <h4>{{ manualInstallWarning.title }}</h4>
                <p>{{ manualInstallWarning.message }}</p>
              </div>
            </div>

            <div class="inst-steps">
              <div v-for="step in manualInstallSteps" :key="step.n" class="inst-step">
                <div class="step-num">{{ step.n }}</div>
                <div class="step-cont">
                  <h4>{{ step.t }}</h4>
                  <p v-html="step.c"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped></style>
