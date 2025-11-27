<script setup lang="ts">
defineProps<{
  currentSection?: string | undefined;
}>();

const emit = defineEmits<{
  goHome: [];
  continue: [];
  close: [];
}>();
</script>

<template>
  <div class="first-visit-overlay">
    <div class="overlay-backdrop" @click="emit('close')"></div>
    <div class="overlay-card">
      <div class="overlay-header">
        <h2 class="slide-title">WICGATE Primer</h2>
        <button class="overlay-close" title="Close" @click="emit('close')">×</button>
      </div>

      <div class="overlay-content">
        <div class="slide">
          <div class="slide-body">
            <p class="slide-text">
              <strong>WICGATE</strong> is a community-hosted multiplayer backend
              (<strong>MASSGATE</strong>) for the game World in Conflict, bringing online play back
              to life.
            </p>
            <div class="cta-box">
              <p class="slide-text mb-4">Getting started is quick and easy:</p>
              <div class="cta-steps">
                <div class="cta-step">
                  <span class="step-number">1</span>
                  <span class="flex flex-col">
                    <span
                      >Buy & install World in Conflict on
                      <a
                        href="https://www.gog.com/game/world_in_conflict_complete_edition"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-link"
                        >GOG</a
                      ></span
                    >
                    <span class="text-sm text-t-dim mt-1"
                      >or use your existing installation from DVD, Steam or Uplay</span
                    >
                  </span>
                </div>
                <div class="cta-step">
                  <span class="step-number">2</span>
                  <span
                    >Download & run
                    <a
                      href="https://github.com/micon4sure/WICLIVE/releases/latest/download/wiclive_x64-setup.exe"
                      class="inline-link"
                      >WIC LIVE</a
                    >
                    - our all-in-one launcher</span
                  >
                </div>
                <div class="cta-step">
                  <span class="step-number">3</span>
                  <span
                    >Create an account ingame: click <code>Multiplayer</code> > <code>Online</code>.
                    From there <code>Create Account</code> on the bottom.</span
                  >
                </div>
                <div class="cta-step">
                  <span class="step-number">4</span>
                  <span
                    >Join us on
                    <a
                      href="https://discord.gg/Udbv9UDBBb"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-link"
                      >Discord</a
                    ></span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="overlay-actions">
          <button class="btn btn-p" @click="emit('continue')">
            Let's Go!
            <i class="fa-solid fa-check ml-2" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
