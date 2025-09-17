<script setup lang="ts">
import {
  requirements,
  versions,
  steps,
  dedicatedServerSteps,
  networkPorts,
  dedicatedServerDownloads,
  manualInstallSteps,
  manualInstallDownloads,
  manualInstallWarning
} from '../content/content';
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

      <!-- Advanced Setup Options -->
      <div class="advanced-section">
        <div class="text-center mb-xl">
          <h2>Advanced Setup Options</h2>
          <p class="section-lead">
            For users who need dedicated server hosting or manual installation
          </p>
        </div>

        <!-- Dedicated Server Setup -->
        <div class="server-setup mb-xl">
          <h3 class="grad-text text-center mb-lg">Dedicated Server Setup</h3>
          <p class="text-center mb-lg text-muted">
            To host your own dedicated server, download the necessary files below:
          </p>

          <div class="download-grid mb-lg">
            <div v-for="download in dedicatedServerDownloads" :key="download.title" class="download-card">
              <h4>{{ download.title }}</h4>
              <p>{{ download.description }}</p>
              <a :href="download.url" class="btn btn-p">Download</a>
            </div>
          </div>

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
              <p class="mb-md">Ensure your router forwards the following ports to the machine running the server:</p>
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

          <div class="download-grid mb-lg">
            <div v-for="download in manualInstallDownloads" :key="download.title" class="download-card">
              <h4>{{ download.title }}</h4>
              <p>{{ download.description }}</p>
              <a :href="download.url" class="btn btn-p">Download</a>
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
  </section>
</template>
<style scoped></style>
