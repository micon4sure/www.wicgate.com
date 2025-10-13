<script setup lang="ts">
import { ref } from 'vue';
import {
  steps,
  dedicatedServerSteps,
  networkPorts,
  manualInstallSteps,
  manualInstallWarning,
} from '../content/content';

// Advanced section toggle state
const showDedicatedServer = ref(false);
const showManualInstall = ref(false);
</script>
<template>
  <section
    id="getting-started"
    class="section bg-gradient-to-b from-graphite/30 to-graphite-dark/50"
  >
    <div class="container max-w-4xl">
      <!-- Header -->
      <div class="text-center mb-20">
        <h2
          class="text-5xl md:text-6xl font-military font-bold text-t uppercase tracking-wider mb-6"
        >
          Getting Started
        </h2>
        <p class="text-lg md:text-xl text-t-secondary max-w-2xl mx-auto font-body leading-relaxed">
          Join the battlefield in minutes with our streamlined setup
        </p>
      </div>

      <!-- Quick Start Steps - Timeline Pattern -->
      <div id="getting-started-quick" class="relative mb-32">
        <!-- Steps -->
        <div class="flex flex-col gap-8">
          <div v-for="(s, index) in steps" :key="s.n" class="relative flex items-start gap-0">
            <!-- Timeline Line Container (behind everything) -->
            <div
              v-if="index < steps.length - 1"
              class="absolute left-[29px] top-[60px] bottom-[-32px] w-[3px] bg-gradient-to-b from-teal/50 via-teal/30 to-teal/50 z-0"
              aria-hidden="true"
            ></div>

            <!-- Badge Container -->
            <div class="flex-shrink-0 relative z-20 mr-6 md:mr-8">
              <div
                class="w-[60px] h-[60px] rounded-full border-[3px] border-teal flex items-center justify-center font-military font-bold text-3xl text-teal shadow-teal-subtle transition-all duration-300 hover:scale-110 hover:shadow-teal-glow md:w-[60px] md:h-[60px] max-md:w-14 max-md:h-14 max-md:text-2xl"
                :class="['bg-gradient-to-br from-graphite-dark via-graphite to-graphite-dark']"
              >
                {{ s.n }}
              </div>
            </div>

            <!-- Step Card -->
            <div
              class="flex-1 relative z-10 bg-gradient-to-br from-graphite-light/80 to-graphite-dark/90 border-2 border-teal/30 border-l-4 border-l-teal/70 rounded-none p-6 md:p-8 transition-all duration-300 hover:border-teal/50 hover:shadow-teal-subtle"
            >
              <h4
                class="font-military font-bold text-2xl md:text-3xl uppercase tracking-wide text-t mb-4 leading-tight"
              >
                {{ s.t }}
              </h4>
              <div class="text-base md:text-lg text-t-secondary font-body leading-relaxed mb-6">
                <template v-if="s.n === 2">
                  WIC LIVE updates your game for WICGATE servers, installs community maps, and adds
                  quality of life fixes for modern systems. After installation, click the "INSTALL
                  UPDATE" button.
                </template>
                <template v-else>
                  <div v-html="s.c"></div>
                </template>
              </div>

              <!-- Download Button (Step 2 only) -->
              <div v-if="s.n === 2" class="mt-6">
                <a
                  id="downloadClientBtn"
                  href="https://github.com/micon4sure/WICLIVE/releases/latest/download/wiclive_x64-setup.exe"
                  class="btn-red inline-flex items-center justify-center gap-3 px-8 py-4 text-lg md:text-xl no-underline animate-red-pulse"
                >
                  <i class="fa-solid fa-download text-xl" aria-hidden="true"></i>
                  <span class="font-black">DOWNLOAD WIC LIVE</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Advanced Setup Options -->
      <div id="getting-started-advanced" class="mt-16">
        <div class="text-center mb-16">
          <h3
            class="text-3xl md:text-4xl font-military font-bold text-t uppercase tracking-wider mb-4"
          >
            Advanced Setup Options
          </h3>
          <p
            class="text-base md:text-lg text-t-secondary max-w-2xl mx-auto font-body leading-relaxed"
          >
            For users who need dedicated server hosting or manual installation
          </p>
        </div>

        <!-- Advanced Options Grid -->
        <div class="flex flex-col gap-6 max-w-5xl mx-auto">
          <!-- Dedicated Server Setup Card -->
          <div
            class="bg-gradient-to-br from-graphite-light/80 to-graphite-dark/90 border-2 border-teal/30 rounded-none overflow-hidden transition-all duration-300 hover:border-teal/60 hover:shadow-teal-subtle"
          >
            <!-- Card Header (Clickable) -->
            <button
              class="w-full flex items-center justify-between p-6 md:p-8 text-left transition-all duration-300 hover:bg-teal/5 group"
              :class="{ 'bg-teal/10': showDedicatedServer }"
              @click="showDedicatedServer = !showDedicatedServer"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-teal/30 to-teal/10 border-2 border-teal flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-teal-subtle"
                >
                  <i
                    class="fa-solid fa-server text-teal text-xl md:text-2xl"
                    aria-hidden="true"
                  ></i>
                </div>
                <div>
                  <h4
                    class="text-xl md:text-2xl font-military font-bold text-t uppercase tracking-wide mb-1"
                  >
                    Dedicated Server Setup
                  </h4>
                  <p class="text-sm md:text-base text-t-secondary font-body">
                    Host your own 24/7 World in Conflict server
                  </p>
                </div>
              </div>
              <div
                class="text-teal text-2xl transition-transform duration-300"
                :class="{ 'rotate-180': showDedicatedServer }"
              >
                <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
              </div>
            </button>

            <!-- Card Content (Collapsible) -->
            <transition
              enter-active-class="transition-all duration-300 ease-out"
              leave-active-class="transition-all duration-300 ease-in"
              enter-from-class="max-h-0 opacity-0"
              enter-to-class="max-h-[2000px] opacity-100"
              leave-from-class="max-h-[2000px] opacity-100"
              leave-to-class="max-h-0 opacity-0"
            >
              <div v-show="showDedicatedServer" class="overflow-hidden">
                <div class="p-6 md:p-8 pt-0 border-t border-teal/20">
                  <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 mt-6">
                    <!-- Server Steps -->
                    <div class="flex flex-col gap-4">
                      <div
                        v-for="step in dedicatedServerSteps"
                        :key="step.n"
                        class="bg-graphite/50 border border-teal/20 p-5 rounded-none hover:border-teal/40 transition-all duration-300"
                      >
                        <div class="flex items-start gap-4">
                          <span
                            class="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-teal/30 to-teal/10 border border-teal rounded-full flex items-center justify-center font-military font-bold text-lg text-teal"
                          >
                            {{ step.n }}
                          </span>
                          <div class="flex-1">
                            <h5 class="font-military font-semibold text-lg uppercase text-t mb-2">
                              {{ step.t }}
                            </h5>
                            <div
                              class="text-sm text-t-secondary font-body leading-relaxed"
                              v-html="step.c"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Network Configuration Sidebar -->
                    <div
                      class="bg-graphite/70 border border-teal/20 p-5 rounded-none h-fit sticky top-24"
                    >
                      <h5
                        class="font-military font-bold uppercase tracking-wider text-lg mb-4 text-teal flex items-center gap-2"
                      >
                        <i class="fa-solid fa-network-wired" aria-hidden="true"></i>
                        Network Ports
                      </h5>
                      <p class="text-t-secondary text-sm mb-4 font-body leading-relaxed">
                        Forward these ports to your server:
                      </p>
                      <div class="space-y-3">
                        <div
                          v-for="port in networkPorts"
                          :key="port.port"
                          class="bg-graphite-dark/60 border border-teal/10 p-3 rounded-none"
                        >
                          <div class="flex items-baseline gap-2 mb-1">
                            <span class="font-mono font-bold text-teal text-base">
                              {{ port.port }}
                            </span>
                            <span class="text-t-secondary text-xs uppercase font-body">
                              {{ port.protocol }}
                            </span>
                          </div>
                          <p
                            v-if="port.description"
                            class="text-t-secondary text-xs font-body leading-relaxed m-0"
                          >
                            {{ port.description }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>

          <!-- Manual Installation Card -->
          <div
            class="bg-gradient-to-br from-graphite-light/80 to-graphite-dark/90 border-2 border-teal/30 rounded-none overflow-hidden transition-all duration-300 hover:border-teal/60 hover:shadow-teal-subtle"
          >
            <!-- Card Header (Clickable) -->
            <button
              class="w-full flex items-center justify-between p-6 md:p-8 text-left transition-all duration-300 hover:bg-teal/5 group"
              :class="{ 'bg-teal/10': showManualInstall }"
              @click="showManualInstall = !showManualInstall"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-teal/30 to-teal/10 border-2 border-teal flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-teal-subtle"
                >
                  <i
                    class="fa-solid fa-wrench text-teal text-xl md:text-2xl"
                    aria-hidden="true"
                  ></i>
                </div>
                <div>
                  <h4
                    class="text-xl md:text-2xl font-military font-bold text-t uppercase tracking-wide mb-1"
                  >
                    Manual Installation
                  </h4>
                  <p class="text-sm md:text-base text-t-secondary font-body">
                    Install WICGATE components individually (unsupported)
                  </p>
                </div>
              </div>
              <div
                class="text-teal text-2xl transition-transform duration-300"
                :class="{ 'rotate-180': showManualInstall }"
              >
                <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
              </div>
            </button>

            <!-- Card Content (Collapsible) -->
            <transition
              enter-active-class="transition-all duration-300 ease-out"
              leave-active-class="transition-all duration-300 ease-in"
              enter-from-class="max-h-0 opacity-0"
              enter-to-class="max-h-[2000px] opacity-100"
              leave-from-class="max-h-[2000px] opacity-100"
              leave-to-class="max-h-0 opacity-0"
            >
              <div v-show="showManualInstall" class="overflow-hidden">
                <div class="p-6 md:p-8 pt-0 border-t border-teal/20">
                  <!-- Warning Banner -->
                  <div
                    class="bg-massgate-red/10 border-2 border-massgate-red/40 rounded-none p-4 flex gap-3 items-start mb-6 mt-6"
                  >
                    <div class="text-massgate-red-bright text-xl flex-shrink-0 mt-0.5">
                      <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
                    </div>
                    <div>
                      <h5
                        class="m-0 mb-2 text-t text-base font-military font-bold uppercase tracking-wide"
                      >
                        {{ manualInstallWarning.title }}
                      </h5>
                      <p class="m-0 text-t-secondary text-sm font-body leading-relaxed">
                        {{ manualInstallWarning.message }}
                      </p>
                    </div>
                  </div>

                  <!-- Manual Installation Steps -->
                  <div class="flex flex-col gap-4">
                    <div
                      v-for="step in manualInstallSteps"
                      :key="step.n"
                      class="bg-graphite/50 border border-teal/20 p-5 rounded-none hover:border-teal/40 transition-all duration-300"
                    >
                      <div class="flex items-start gap-4">
                        <span
                          class="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-teal/30 to-teal/10 border border-teal rounded-full flex items-center justify-center font-military font-bold text-lg text-teal"
                        >
                          {{ step.n }}
                        </span>
                        <div class="flex-1">
                          <h5 class="font-military font-semibold text-lg uppercase text-t mb-2">
                            {{ step.t }}
                          </h5>
                          <div
                            class="text-sm text-t-secondary font-body leading-relaxed"
                            v-html="step.c"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
