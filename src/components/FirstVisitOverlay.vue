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

<style scoped>
.first-visit-overlay {
  @apply fixed inset-0 z-[10000] flex items-center justify-center p-5;
}

.overlay-backdrop {
  @apply absolute inset-0 bg-black/85 backdrop-blur-md;
}

.overlay-card {
  @apply relative bg-gradient-to-b from-graphite-light to-graphite-dark border border-t-dim/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-massgate-panel;
}

.overlay-header {
  @apply py-6 px-6 border-b border-t-dim/20 flex items-center justify-between;
}

.slide-indicators {
  @apply flex gap-2;
}

.indicator {
  @apply w-2 h-2 rounded-full bg-t-dim/30 transition-all duration-300;
}

.indicator.active {
  @apply w-8 bg-soviet;
  box-shadow: 0 0 15px rgba(255, 102, 0, 0.5);
}

.overlay-close {
  @apply bg-transparent border-0 text-t-dim text-2xl cursor-pointer p-1 rounded transition-all duration-200 leading-none hover:bg-white/10 hover:text-t active:scale-90;
}

.overlay-content {
  @apply py-8 px-8 max-h-[calc(90vh-140px)] overflow-y-auto;
}

.slide {
  @apply min-h-[400px] flex flex-col items-center;
}

.slide-icon {
  @apply w-20 h-20 flex items-center justify-center bg-gradient-to-br from-soviet/30 to-soviet/15 border-2 border-soviet/50 rounded-2xl text-4xl text-soviet mb-6;
  box-shadow: 0 0 20px rgba(255, 102, 0, 0.4);
}

.slide-icon.wicgate {
  @apply from-massgate-red/30 to-massgate-red-dark/20 border-massgate-red/50 text-massgate-red-bright;
  box-shadow: 0 0 20px rgba(198, 40, 40, 0.4);
}

.slide-icon.ready {
  @apply from-massgate-gold/30 to-massgate-gold-dark/20 border-massgate-gold/60 text-massgate-gold;
  box-shadow: 0 0 25px rgba(255, 202, 40, 0.5);
}

.slide-title {
  @apply text-3xl font-military font-bold text-t uppercase tracking-wide mb-4 text-center;
}

.slide-body {
  @apply w-full space-y-4;
}

.slide-text {
  @apply text-lg text-t-secondary leading-relaxed text-center font-body;
}

.feature-list {
  @apply space-y-3 mt-6;
}

.feature-item {
  @apply flex items-start gap-3 p-3 bg-texture-panel/40 border border-t-dim/10 rounded-lg;
}

.feature-item i {
  @apply text-xl text-soviet flex-shrink-0 mt-0.5;
}

.feature-item span {
  @apply text-t-secondary font-body leading-relaxed;
}

.highlight-box {
  @apply bg-gradient-to-br from-massgate-red-dark/20 to-massgate-red-dark/10 border-l-4 border-massgate-red p-4 rounded-lg flex gap-4 items-start;
  box-shadow:
    0 0 15px rgba(198, 40, 40, 0.2),
    inset 0 0 10px rgba(198, 40, 40, 0.02);
}

.highlight-box i {
  @apply text-2xl text-massgate-red-bright flex-shrink-0 mt-1;
}

.highlight-box p {
  @apply text-base text-t-secondary leading-relaxed font-body m-0;
}

.cta-box {
  @apply bg-gradient-to-br from-texture-panel to-texture-dark border border-massgate-gold/30 rounded-xl p-6;
  box-shadow:
    0 4px 20px rgba(255, 202, 40, 0.3),
    inset 0 -1px 10px rgba(255, 213, 79, 0.09);
}

.cta-steps {
  @apply space-y-4;
}

.cta-step {
  @apply flex items-center gap-4 p-3 bg-texture-lighter/50 rounded-lg border border-t-dim/10;
}

.step-number {
  @apply w-10 h-10 flex items-center justify-center bg-gradient-to-br from-massgate-gold to-massgate-gold-dark text-ink font-military font-bold text-xl rounded-lg flex-shrink-0;
  box-shadow: 0 0 20px rgba(255, 202, 40, 0.4);
}

.cta-step span:last-child {
  @apply text-t font-body font-medium;
}

.overlay-actions {
  @apply flex gap-3 mt-8 justify-end;
}

.btn-secondary {
  @apply bg-white/10 border border-white/20 text-t-secondary py-3 px-6 rounded-lg cursor-pointer transition-all duration-200 font-medium font-body hover:bg-white/15 hover:text-t hover:border-white/30;
}

.overlay-actions .btn {
  @apply px-8;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .overlay-card {
    @apply m-3 max-w-none;
  }

  .overlay-header,
  .overlay-content {
    @apply py-5 px-5;
  }

  .slide {
    @apply min-h-[350px];
  }

  .slide-title {
    @apply text-2xl;
  }

  .slide-icon {
    @apply w-16 h-16 text-3xl;
  }

  .overlay-actions {
    @apply flex-col;
  }

  .overlay-actions .btn,
  .btn-secondary {
    @apply w-full;
  }
}

@media (max-width: 480px) {
  .overlay-header,
  .overlay-content {
    @apply py-4 px-4;
  }

  .slide-title {
    @apply text-xl;
  }

  .slide-text {
    @apply text-base;
  }
}
</style>
