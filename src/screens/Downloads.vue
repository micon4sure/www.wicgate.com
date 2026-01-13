<script setup lang="ts">
import TabContainer from '../components/TabContainer.vue';
import { WICLIVE_URL } from '@/constants';
import {
  steps,
  dedicatedServerSteps,
  networkPorts,
  manualInstallSteps,
  manualInstallWarning,
} from '../content/content';
import { useInternalLinks } from '../composables/useInternalLinks';

// Client-side navigation for internal links in warning messages
const { handleContentClick } = useInternalLinks();

// Tab configuration - IDs map to URL anchors (e.g., #quick-install, #dedicated-server)
const tabs = [
  { id: 'downloads-quick-install', label: 'Quick Install', icon: 'fa-solid fa-rocket' },
  { id: 'downloads-dedicated-server', label: 'Dedicated Server', icon: 'fa-solid fa-server' },
  { id: 'downloads-manual-install', label: 'Manual Install', icon: 'fa-solid fa-wrench' },
];
</script>

<template>
  <section id="downloads" class="section bg-downloads-section">
    <div class="container">
      <!-- Header -->
      <div class="text-center mb-12">
        <h2
          class="text-5xl lg:text-6xl font-military font-bold text-t uppercase tracking-wider mb-6"
        >
          Downloads
        </h2>
        <p class="text-lg lg:text-xl text-t-secondary max-w-2xl mx-auto font-body leading-relaxed">
          Choose your installation method and join the battlefield
        </p>
      </div>

      <!-- Tab Container -->
      <TabContainer :tabs="tabs" aria-label="Download methods">
        <!-- Tab 1: Quick Install -->
        <template #quick-install>
          <div class="py-8 lg:py-12">
            <div class="text-center mb-10">
              <h3
                class="text-2xl lg:text-3xl font-military font-bold text-t uppercase tracking-wider mb-3"
              >
                Recommended for Most Users
              </h3>
              <p class="text-data text-t-secondary font-body">
                WIC LIVE is the fastest way to get playing with one-click installation
              </p>
            </div>

            <!-- Installation Steps -->
            <div class="flex flex-col gap-4">
              <div v-for="s in steps" :key="s.n" class="step-card">
                <div class="flex items-start gap-4">
                  <span class="step-number-badge-lg">
                    {{ s.n }}
                  </span>
                  <div class="flex-1">
                    <h5 class="font-military font-semibold text-heading uppercase text-t mb-2">
                      {{ s.t }}
                    </h5>
                    <div class="text-data text-t-secondary font-body leading-relaxed">
                      <template v-if="s.n === 2">
                        WIC LIVE updates your game for WICGATE servers, installs community maps, and
                        adds quality of life fixes for modern systems. After installation, click the
                        "INSTALL UPDATE" button.
                      </template>
                      <template v-else>
                        <div v-html="s.c"></div>
                      </template>
                    </div>

                    <div v-if="s.n === 2" class="mt-4">
                      <a
                        id="downloadClientBtn"
                        :href="WICLIVE_URL"
                        class="hero-cta"
                        title="Download WIC LIVE installer"
                      >
                        <i
                          class="fa-solid fa-download text-sm sm:text-base lg:text-lg xl:text-xl"
                          aria-hidden="true"
                        ></i>
                        <span>DOWNLOAD NOW</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Tab 2: Dedicated Server -->
        <template #dedicated-server>
          <div class="py-8 lg:py-12">
            <div class="text-center mb-10">
              <h3
                class="text-2xl lg:text-3xl font-military font-bold text-t uppercase tracking-wider mb-3"
              >
                Host Your Own 24/7 Server
              </h3>
              <p class="text-data text-t-secondary font-body">
                Run a dedicated World in Conflict server for your community
              </p>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-8">
              <!-- Server Steps -->
              <div class="flex flex-col gap-4">
                <div v-for="step in dedicatedServerSteps" :key="step.n" class="step-card">
                  <div class="flex items-start gap-4">
                    <span class="step-number-badge-sm">
                      {{ step.n }}
                    </span>
                    <div class="flex-1">
                      <h5 class="font-military font-semibold text-heading uppercase text-t mb-2">
                        {{ step.t }}
                      </h5>
                      <div
                        class="text-data text-t-secondary font-body leading-relaxed"
                        v-html="step.c"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Network Configuration Sidebar -->
              <div class="step-card-sticky">
                <h5
                  class="font-military font-bold uppercase tracking-wider text-heading mb-4 text-t flex items-center gap-3"
                >
                  <div
                    class="flex-shrink-0 w-8 h-8 bg-gradient-to-b from-massgate-orange to-massgate-orange-dark border border-massgate-orange-dark rounded-full flex items-center justify-center"
                  >
                    <i
                      class="fa-solid fa-network-wired text-dark-navy text-xs"
                      aria-hidden="true"
                    ></i>
                  </div>
                  Network Ports
                </h5>
                <p class="text-t-secondary text-data mb-4 font-body leading-relaxed">
                  Forward these ports to your server:
                </p>
                <div class="space-y-3">
                  <div
                    v-for="port in networkPorts"
                    :key="port.port"
                    class="bg-dark-navy-dark/60 border border-card p-3 rounded-none"
                  >
                    <div class="flex items-baseline gap-2 mb-1">
                      <span class="font-mono font-bold text-t text-data">
                        {{ port.port }}
                      </span>
                      <span class="text-t-secondary text-xs uppercase font-body">
                        {{ port.protocol }}
                      </span>
                    </div>
                    <p
                      v-if="port.description"
                      class="text-t-secondary text-sm font-body leading-relaxed m-0"
                    >
                      {{ port.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Tab 3: Manual Install -->
        <template #manual-install>
          <div class="py-8 lg:py-12">
            <div class="text-center mb-10">
              <h3
                class="text-2xl lg:text-3xl font-military font-bold text-t uppercase tracking-wider mb-3"
              >
                Advanced Users Only
              </h3>
              <p class="text-data text-t-secondary font-body">
                Install WICGATE components individually (unsupported)
              </p>
            </div>

            <!-- Warning Banner -->
            <div
              class="bg-massgate-red/10 border-2 border-massgate-red/40 rounded-none p-4 flex gap-3 items-start mb-8"
            >
              <div class="text-massgate-red text-xl flex-shrink-0 mt-0.5">
                <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
              </div>
              <div>
                <h5
                  class="m-0 mb-2 text-t text-data font-military font-bold uppercase tracking-wide"
                >
                  {{ manualInstallWarning.title }}
                </h5>
                <p
                  class="m-0 text-t-secondary text-data font-body leading-relaxed"
                  @click="handleContentClick"
                  v-html="manualInstallWarning.message"
                ></p>
              </div>
            </div>

            <!-- Manual Installation Steps -->
            <div class="flex flex-col gap-4">
              <div v-for="step in manualInstallSteps" :key="step.n" class="step-card">
                <div class="flex items-start gap-4">
                  <span class="step-number-badge-sm">
                    {{ step.n }}
                  </span>
                  <div class="flex-1">
                    <h5 class="font-military font-semibold text-heading uppercase text-t mb-2">
                      {{ step.t }}
                    </h5>
                    <div
                      class="text-data text-t-secondary font-body leading-relaxed"
                      v-html="step.c"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </TabContainer>
    </div>
  </section>
</template>
