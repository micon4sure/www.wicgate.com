<script setup lang="ts">
import { WICLIVE_URL, DISCORD_URL, GOG_URL } from '@/constants';
import BaseOverlay from './BaseOverlay.vue';

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
  <BaseOverlay
    title="WICGATE Quick Start"
    :use-teleport="false"
    aria-labelledby="first-visit-title"
    @close="emit('close')"
  >
    <div class="slide">
      <div class="slide-body">
        <p class="slide-text">
          <strong>WICGATE</strong> is a community-hosted multiplayer backend
          (<strong>MASSGATE</strong>) for the game World in Conflict, bringing online play back to
          life.
        </p>
        <div class="cta-box">
          <p class="slide-text mb-4">Getting started is quick and easy:</p>
          <div class="cta-steps">
            <div class="cta-step">
              <span class="step-number">1</span>
              <span class="flex flex-col">
                <span
                  >Buy & install World in Conflict on
                  <a :href="GOG_URL" target="_blank" rel="noopener noreferrer" class="inline-link"
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
                <a :href="WICLIVE_URL" class="inline-link">WIC LIVE</a>
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
                <a :href="DISCORD_URL" target="_blank" rel="noopener noreferrer" class="inline-link"
                  >Discord</a
                ></span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="overlay-actions">
      <button class="btn btn-p" @click="emit('continue')">
        Let's Go!
        <i class="fa-solid fa-check ml-2" aria-hidden="true"></i>
      </button>
    </div>
  </BaseOverlay>
</template>
