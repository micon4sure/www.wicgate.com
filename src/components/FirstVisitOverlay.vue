<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  currentSection?: string | undefined;
}>();

const emit = defineEmits<{
  goHome: [];
  continue: [];
  close: [];
}>();

const currentSlide = ref(0);
const totalSlides = 3;

function nextSlide() {
  if (currentSlide.value < totalSlides - 1) {
    currentSlide.value++;
  } else {
    emit('continue');
  }
}

function prevSlide() {
  if (currentSlide.value > 0) {
    currentSlide.value--;
  }
}
</script>

<template>
  <div class="first-visit-overlay">
    <div class="overlay-backdrop" @click="emit('close')"></div>
    <div class="overlay-card">
      <div class="overlay-header">
        <div class="slide-indicators">
          <span
            v-for="i in totalSlides"
            :key="i"
            :class="['indicator', { active: currentSlide === i - 1 }]"
          ></span>
        </div>
        <button class="overlay-close" title="Close" @click="emit('close')">×</button>
      </div>

      <div class="overlay-content">
        <!-- Slide 1: What is World in Conflict? -->
        <div v-show="currentSlide === 0" class="slide">
          <div class="slide-icon">
            <i class="fa-solid fa-gamepad" aria-hidden="true"></i>
          </div>
          <h2 class="slide-title">What is World in Conflict?</h2>
          <div class="slide-body">
            <p class="slide-text">
              <strong>World in Conflict</strong> is a critically acclaimed real-time strategy game
              released in 2007 by Massive Entertainment.
            </p>
            <div class="feature-list">
              <div class="feature-item">
                <i class="fa-solid fa-tank" aria-hidden="true"></i>
                <span>Intense Cold War battles between NATO and Soviet forces</span>
              </div>
              <div class="feature-item">
                <i class="fa-solid fa-users-gear" aria-hidden="true"></i>
                <span>Tactical multiplayer gameplay with up to 16 players</span>
              </div>
              <div class="feature-item">
                <i class="fa-solid fa-trophy" aria-hidden="true"></i>
                <span>Award-winning graphics and cinematic destruction</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Slide 2: What is WiCGate? -->
        <div v-show="currentSlide === 1" class="slide">
          <div class="slide-icon wicgate">
            <i class="fa-solid fa-server" aria-hidden="true"></i>
          </div>
          <h2 class="slide-title">What is WiCGate?</h2>
          <div class="slide-body">
            <p class="slide-text">
              When the official <strong>Massgate</strong> multiplayer servers shut down, the
              community stepped up.
            </p>
            <div class="highlight-box">
              <i class="fa-solid fa-code" aria-hidden="true"></i>
              <p>
                WiCGate has <strong>restored official multiplayer</strong> using the real Massgate
                server code, bringing World in Conflict back online for the community.
              </p>
            </div>
            <div class="feature-list">
              <div class="feature-item">
                <i class="fa-solid fa-shield-halved text-online" aria-hidden="true"></i>
                <span>Official server code - not a reverse-engineered clone</span>
              </div>
              <div class="feature-item">
                <i class="fa-solid fa-users text-soviet" aria-hidden="true"></i>
                <span>Active community with regular players and events</span>
              </div>
              <div class="feature-item">
                <i class="fa-solid fa-heart text-massgate-red-bright" aria-hidden="true"></i>
                <span>100% free - maintained by passionate volunteers</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Slide 3: Ready to Play? -->
        <div v-show="currentSlide === 2" class="slide">
          <div class="slide-icon ready">
            <i class="fa-solid fa-rocket" aria-hidden="true"></i>
          </div>
          <h2 class="slide-title">Ready to Join the Battle?</h2>
          <div class="slide-body">
            <p class="slide-text">
              Getting started is quick and easy - you'll be in-game within minutes!
            </p>
            <div class="cta-box">
              <div class="cta-steps">
                <div class="cta-step">
                  <span class="step-number">1</span>
                  <span>Download WICGATE installer</span>
                </div>
                <div class="cta-step">
                  <span class="step-number">2</span>
                  <span>Run the automatic setup</span>
                </div>
                <div class="cta-step">
                  <span class="step-number">3</span>
                  <span>Launch the game and play!</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="overlay-actions">
          <button v-if="currentSlide > 0" class="btn btn-secondary" @click="prevSlide">
            <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Back
          </button>
          <button v-if="currentSlide === 0" class="btn btn-secondary" @click="emit('close')">
            Skip Tutorial
          </button>
          <button class="btn btn-p" @click="nextSlide">
            {{ currentSlide === totalSlides - 1 ? "Let's Go!" : 'Next' }}
            <i
              v-if="currentSlide < totalSlides - 1"
              class="fa-solid fa-arrow-right ml-2"
              aria-hidden="true"
            ></i>
            <i v-else class="fa-solid fa-check ml-2" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
