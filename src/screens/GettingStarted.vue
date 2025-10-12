<script setup lang="ts">
import {
  steps,
  dedicatedServerSteps,
  networkPorts,
  manualInstallSteps,
  manualInstallWarning,
} from '../content/content';
</script>
<template>
  <section id="getting-started" class="section bg-bg-panel">
    <div class="container">
      <!-- Header -->
      <div class="text-center mb-16">
        <h2
          class="text-5xl md:text-6xl font-military font-bold text-t uppercase tracking-wider mb-4"
        >
          Getting Started
        </h2>
        <p class="text-lg md:text-xl text-t-secondary max-w-2xl mx-auto font-body leading-relaxed">
          Join the battlefield in minutes with our streamlined setup
        </p>
      </div>

      <!-- Quick Start Steps -->
      <div id="getting-started-quick" class="flex flex-col gap-5 mb-20">
        <div
          v-for="s in steps"
          :key="s.n"
          class="panel-card border-l-4 border-l-soviet/70 p-6 flex gap-6 md:flex-row flex-col md:text-left text-center"
        >
          <!-- Step Badge -->
          <div
            class="w-14 h-14 bg-soviet-gradient border-2 border-soviet/85 flex items-center justify-center font-military font-bold text-2xl text-ink shadow-soviet-glow md:self-start self-center flex-shrink-0 rounded-none"
          >
            {{ s.n }}
          </div>

          <!-- Content -->
          <div class="flex-1">
            <h4 class="font-military font-semibold text-xl uppercase tracking-wide text-t mb-3">
              {{ s.t }}
            </h4>
            <div class="text-t-secondary font-body leading-relaxed" v-html="s.c"></div>
          </div>
        </div>
      </div>

      <!-- Advanced Setup Options -->
      <div id="getting-started-advanced" class="mt-16">
        <div class="text-center mb-16">
          <h2
            class="text-5xl md:text-6xl font-military font-bold text-t uppercase tracking-wider mb-4"
          >
            Advanced Setup Options
          </h2>
          <p
            class="text-lg md:text-xl text-t-secondary max-w-2xl mx-auto font-body leading-relaxed"
          >
            For users who need dedicated server hosting or manual installation
          </p>
        </div>

        <!-- Dedicated Server Setup -->
        <div class="relative mb-16">
          <h3
            class="text-gradient-soviet text-4xl font-military font-bold text-center uppercase tracking-wide mb-8"
          >
            Dedicated Server Setup
          </h3>
          <p class="text-center mb-8 text-t-secondary font-body text-lg">
            To host your own dedicated server, follow these steps:
          </p>

          <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 mb-10">
            <!-- Server Steps -->
            <div class="flex flex-col gap-5">
              <div
                v-for="step in dedicatedServerSteps"
                :key="step.n"
                class="panel-card border-l-4 border-l-soviet/70 p-6 flex gap-6 md:flex-row flex-col md:text-left text-center"
              >
                <div
                  class="w-14 h-14 bg-soviet-gradient border-2 border-soviet/85 flex items-center justify-center font-military font-bold text-2xl text-ink shadow-soviet-glow md:self-start self-center flex-shrink-0 rounded-none"
                >
                  {{ step.n }}
                </div>
                <div class="flex-1">
                  <h4
                    class="font-military font-semibold text-xl uppercase tracking-wide text-t mb-3"
                  >
                    {{ step.t }}
                  </h4>
                  <p class="text-t-secondary font-body leading-relaxed" v-html="step.c"></p>
                </div>
              </div>
            </div>

            <!-- Network Configuration Sidebar -->
            <div class="panel-card border-l-4 border-l-soviet/70 p-6">
              <h3
                class="text-gradient-soviet font-military font-semibold uppercase tracking-wider text-xl mb-4"
              >
                Network Configuration
              </h3>
              <p class="text-t-secondary mb-4 font-body leading-relaxed">
                Ensure your router forwards the following ports to the machine running the server:
              </p>
              <div class="my-4">
                <div
                  v-for="port in networkPorts"
                  :key="port.port"
                  class="flex items-center gap-2 py-2 border-b border-mg/20 last:border-b-0 md:flex-row flex-col md:items-center items-start md:gap-2 gap-1"
                >
                  <span
                    class="font-mono font-bold text-soviet min-w-[100px] tracking-wider md:min-w-[100px] min-w-0"
                  >
                    {{ port.port }}
                  </span>
                  <span class="text-t-secondary text-sm min-w-[80px] md:min-w-[80px] min-w-0">
                    ({{ port.protocol }})
                  </span>
                  <p
                    v-if="port.description"
                    class="m-0 text-t-secondary text-sm flex-1 font-body leading-relaxed"
                  >
                    {{ port.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Manual Installation -->
        <div class="relative">
          <h3
            class="text-gradient-soviet text-4xl font-military font-bold text-center uppercase tracking-wide mb-8"
          >
            Manual WICGATE Installation
          </h3>

          <!-- Warning Banner -->
          <div
            class="bg-red-soviet/10 border-2 border-red-light/40 border-l-4 border-l-red-light/75 shadow-red-glow/20 p-5 flex gap-4 items-start mb-8"
          >
            <div
              class="text-red-light/90 text-2xl flex-shrink-0 mt-1 drop-shadow-lg md:text-2xl text-xl"
            >
              <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div>
              <h4
                class="m-0 mb-2 text-t text-lg font-military font-semibold uppercase tracking-wide"
              >
                {{ manualInstallWarning.title }}
              </h4>
              <p class="m-0 text-t-secondary font-body leading-relaxed">
                {{ manualInstallWarning.message }}
              </p>
            </div>
          </div>

          <!-- Manual Installation Steps -->
          <div class="flex flex-col gap-5">
            <div
              v-for="step in manualInstallSteps"
              :key="step.n"
              class="panel-card border-l-4 border-l-soviet/70 p-6 flex gap-6 md:flex-row flex-col md:text-left text-center"
            >
              <div
                class="w-14 h-14 bg-soviet-gradient border-2 border-soviet/85 flex items-center justify-center font-military font-bold text-2xl text-ink shadow-soviet-glow md:self-start self-center flex-shrink-0 rounded-none"
              >
                {{ step.n }}
              </div>
              <div class="flex-1">
                <h4 class="font-military font-semibold text-xl uppercase tracking-wide text-t mb-3">
                  {{ step.t }}
                </h4>
                <p class="text-t-secondary font-body leading-relaxed" v-html="step.c"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped></style>
