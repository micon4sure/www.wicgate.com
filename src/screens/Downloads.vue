<script setup lang="ts">
import TabContainer from '../components/TabContainer.vue';
import {
  steps,
  dedicatedServerSteps,
  networkPorts,
  manualInstallSteps,
  manualInstallWarning,
} from '../content/content';

// Tab configuration
const tabs = [
  { id: 'downloads-quick', label: 'Quick Install', icon: 'fa-solid fa-rocket' },
  { id: 'downloads-server', label: 'Dedicated Server', icon: 'fa-solid fa-server' },
  { id: 'downloads-manual', label: 'Manual Install', icon: 'fa-solid fa-wrench' },
];
</script>

<template>
  <section id="downloads" class="section bg-gradient-to-b from-graphite/30 to-graphite-dark/50">
    <div class="container max-w-6xl">
      <!-- Header -->
      <div class="text-center mb-12">
        <h2
          class="text-5xl md:text-6xl font-military font-bold text-t uppercase tracking-wider mb-6"
        >
          Downloads
        </h2>
        <p class="text-lg md:text-xl text-t-secondary max-w-2xl mx-auto font-body leading-relaxed">
          Choose your installation method and join the battlefield
        </p>
      </div>

      <!-- Tab Container -->
      <TabContainer :tabs="tabs" analytics-category="Downloads" aria-label="Download methods">
        <!-- Tab 1: Quick Install -->
        <template #quick>
          <div class="p-8 md:p-12 max-w-4xl mx-auto">
            <div class="text-center mb-10">
              <h3
                class="text-2xl md:text-3xl font-military font-bold text-t uppercase tracking-wider mb-3"
              >
                Recommended for Most Users
              </h3>
              <p class="text-base md:text-lg text-t-secondary font-body">
                WIC LIVE is the fastest way to get playing with one-click installation
              </p>
            </div>

            <!-- Timeline Steps -->
            <div class="relative flex flex-col gap-8">
              <div v-for="(s, index) in steps" :key="s.n" class="relative flex items-start gap-0">
                <!-- Timeline Line -->
                <div
                  v-if="index < steps.length - 1"
                  class="absolute left-[29px] top-[60px] bottom-[-32px] w-[3px] bg-gradient-to-b from-teal/50 via-teal/30 to-teal/50 z-0"
                  aria-hidden="true"
                ></div>

                <!-- Step Badge -->
                <div class="flex-shrink-0 relative z-20 mr-6 md:mr-8">
                  <div
                    class="w-[60px] h-[60px] rounded-full border-[3px] border-teal-darker bg-gradient-to-b from-teal-bright to-teal-glow flex items-center justify-center font-military font-bold text-3xl text-ink md:w-[60px] md:h-[60px] max-md:w-14 max-md:h-14 max-md:text-2xl"
                  >
                    {{ s.n }}
                  </div>
                </div>

                <!-- Step Card -->
                <div
                  class="flex-1 relative z-10 bg-gradient-to-br from-panel/95 to-panel-dark/98 border-2 border-teal/30 border-l-4 border-l-massgate-orange/70 rounded-none p-6 md:p-8"
                >
                  <h4
                    class="font-military font-bold text-2xl md:text-3xl uppercase tracking-wide text-t mb-4 leading-tight"
                  >
                    {{ s.t }}
                  </h4>
                  <div class="text-base md:text-lg text-t-secondary font-body leading-relaxed mb-6">
                    <template v-if="s.n === 2">
                      WIC LIVE updates your game for WICGATE servers, installs community maps, and
                      adds quality of life fixes for modern systems. After installation, click the
                      "INSTALL UPDATE" button.
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
        </template>

        <!-- Tab 2: Dedicated Server -->
        <template #server>
          <div class="p-8 md:p-12">
            <div class="text-center mb-10">
              <h3
                class="text-2xl md:text-3xl font-military font-bold text-t uppercase tracking-wider mb-3"
              >
                Host Your Own 24/7 Server
              </h3>
              <p class="text-base md:text-lg text-t-secondary font-body">
                Run a dedicated World in Conflict server for your community
              </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
              <!-- Server Steps -->
              <div class="flex flex-col gap-4">
                <div
                  v-for="step in dedicatedServerSteps"
                  :key="step.n"
                  class="bg-graphite/50 border border-teal/20 p-5 rounded-none"
                >
                  <div class="flex items-start gap-4">
                    <span
                      class="flex-shrink-0 w-8 h-8 bg-gradient-to-b from-teal-bright to-teal-glow border border-teal-darker rounded-full flex items-center justify-center font-military font-bold text-lg text-ink"
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
                class="bg-graphite/70 border border-teal/20 p-5 rounded-none h-fit lg:sticky lg:top-24"
              >
                <h5
                  class="font-military font-bold uppercase tracking-wider text-lg mb-4 text-t flex items-center gap-3"
                >
                  <div
                    class="flex-shrink-0 w-8 h-8 bg-gradient-to-b from-teal-bright to-teal-glow border border-teal-darker rounded-full flex items-center justify-center"
                  >
                    <i class="fa-solid fa-network-wired text-ink text-xs" aria-hidden="true"></i>
                  </div>
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
        </template>

        <!-- Tab 3: Manual Install -->
        <template #manual>
          <div class="p-8 md:p-12 max-w-4xl mx-auto">
            <div class="text-center mb-10">
              <h3
                class="text-2xl md:text-3xl font-military font-bold text-t uppercase tracking-wider mb-3"
              >
                Advanced Users Only
              </h3>
              <p class="text-base md:text-lg text-t-secondary font-body">
                Install WICGATE components individually (unsupported)
              </p>
            </div>

            <!-- Warning Banner -->
            <div
              class="bg-massgate-red/10 border-2 border-massgate-red/40 rounded-none p-4 flex gap-3 items-start mb-8"
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
                class="bg-graphite/50 border border-teal/20 p-5 rounded-none"
              >
                <div class="flex items-start gap-4">
                  <span
                    class="flex-shrink-0 w-8 h-8 bg-gradient-to-b from-teal-bright to-teal-glow border border-teal-darker rounded-full flex items-center justify-center font-military font-bold text-lg text-ink"
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
        </template>
      </TabContainer>
    </div>
  </section>
</template>
