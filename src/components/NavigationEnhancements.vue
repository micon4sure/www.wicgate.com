<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { rafThrottle } from '../utils/rafThrottle';

const props = defineProps<{
  currentSection?: string;
  sections: Array<{ id: string; title: string; description?: string }>;
}>();

const emit = defineEmits<{
  navigate: [string];
}>();

// Scroll progress tracking
const scrollProgress = ref(0);
const showBackToTop = ref(false);

// Section navigation state
const sectionProgress = computed(() => {
  if (!props.currentSection) return 0;
  const currentIndex = props.sections.findIndex((s) => s.id === props.currentSection);
  return currentIndex >= 0 ? ((currentIndex + 1) / props.sections.length) * 100 : 0;
});

// Current section info
const currentSectionInfo = computed(() => {
  const fallback = { id: 'hero', title: 'Home', description: 'Welcome to WICGATE' };
  if (!props.sections || props.sections.length === 0) return fallback;
  if (!props.currentSection) return props.sections[0];
  return props.sections.find((s) => s.id === props.currentSection) || props.sections[0] || fallback;
});

// Next and previous sections
const previousSection = computed(() => {
  if (!props.currentSection) return null;
  const currentIndex = props.sections.findIndex((s) => s.id === props.currentSection);
  return currentIndex > 0 ? props.sections[currentIndex - 1] : null;
});

const nextSection = computed(() => {
  if (!props.sections || props.sections.length === 0) return null;
  if (!props.currentSection) return props.sections.length > 1 ? props.sections[1] : null;
  const currentIndex = props.sections.findIndex((s) => s.id === props.currentSection);
  return currentIndex >= 0 && currentIndex < props.sections.length - 1
    ? props.sections[currentIndex + 1]
    : null;
});

// Scroll tracking
function updateScrollProgress() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight - document.documentElement.clientHeight;
  scrollProgress.value = (scrollTop / scrollHeight) * 100;
  showBackToTop.value = scrollTop > 500;
}

// Navigation functions
function navigateToSection(sectionId: string) {
  emit('navigate', sectionId);
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToPreviousSection() {
  if (previousSection.value) {
    navigateToSection(previousSection.value.id);
  }
}

function goToNextSection() {
  if (nextSection.value) {
    navigateToSection(nextSection.value.id);
  }
}

// Throttle scroll handler with RAF for 60fps performance
const throttledScrollUpdate = rafThrottle(updateScrollProgress);

onMounted(() => {
  window.addEventListener('scroll', throttledScrollUpdate, { passive: true });
  updateScrollProgress();
});

onUnmounted(() => {
  throttledScrollUpdate.cancel();
  window.removeEventListener('scroll', throttledScrollUpdate);
});
</script>

<template>
  <div class="navigation-enhancements">
    <!-- Scroll Progress Bar -->
    <div class="scroll-progress-bar">
      <div class="scroll-progress-fill" :style="{ width: scrollProgress + '%' }"></div>
    </div>

    <!-- Section Breadcrumb -->
    <div v-if="currentSection" class="section-breadcrumb">
      <div class="breadcrumb-container">
        <div class="breadcrumb-content">
          <div class="breadcrumb-path">
            <span class="breadcrumb-home" @click="navigateToSection('hero')">
              <i class="fa-solid fa-home" aria-hidden="true"></i>
              Home
            </span>
            <i class="fa-solid fa-chevron-right breadcrumb-separator" aria-hidden="true"></i>
            <span class="breadcrumb-current">{{ currentSectionInfo.title }}</span>
          </div>

          <div class="section-progress">
            <div class="progress-indicator">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: sectionProgress + '%' }"></div>
              </div>
              <span class="progress-text">
                {{ sections.findIndex((s) => s.id === currentSection) + 1 }} / {{ sections.length }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Navigation -->
    <div class="section-navigation">
      <div class="nav-container">
        <!-- Previous Section -->
        <button v-if="previousSection" class="nav-btn nav-prev" @click="goToPreviousSection">
          <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
          <div class="nav-content">
            <span class="nav-label">Previous</span>
            <span class="nav-title">{{ previousSection.title }}</span>
          </div>
        </button>

        <!-- Quick Section Links -->
        <div class="quick-nav">
          <button
            v-for="section in sections.slice(0, 5)"
            :key="section.id"
            :class="{ active: currentSection === section.id }"
            class="quick-nav-btn"
            :title="section.title"
            @click="navigateToSection(section.id)"
          >
            <span class="quick-nav-dot"></span>
          </button>
        </div>

        <!-- Next Section -->
        <button v-if="nextSection" class="nav-btn nav-next" @click="goToNextSection">
          <div class="nav-content">
            <span class="nav-label">Next</span>
            <span class="nav-title">{{ nextSection.title }}</span>
          </div>
          <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
        </button>
      </div>
    </div>

    <!-- Back to Top Button -->
    <Transition name="back-to-top">
      <button
        v-if="showBackToTop"
        class="back-to-top-btn"
        aria-label="Back to top"
        @click="scrollToTop"
      >
        <i class="fa-solid fa-chevron-up" aria-hidden="true"></i>
      </button>
    </Transition>
  </div>
</template>

<style scoped>
/* Scroll Progress Bar */
.scroll-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: rgba(var(--mg-rgb), 0.2);
  z-index: 1000;
}

.scroll-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--sw) 0%, rgba(var(--sw-rgb), 0.8) 100%);
  transition: width 0.1s ease;
  box-shadow: 0 0 10px rgba(var(--sw-rgb), 0.5);
}

/* Section Breadcrumb */
.section-breadcrumb {
  position: sticky;
  top: 0;
  background: linear-gradient(180deg, rgba(var(--s1-rgb), 0.95) 0%, rgba(var(--s2-rgb), 0.9) 100%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--divider-soft);
  z-index: 100;
  padding: 12px 0;
}

.breadcrumb-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.breadcrumb-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.breadcrumb-path {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 500;
}

.breadcrumb-home {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--t3);
  cursor: pointer;
  transition: color 0.3s ease;
  font-size: 0.9rem;
}

.breadcrumb-home:hover {
  color: var(--sw);
}

.breadcrumb-separator {
  color: var(--t3);
  font-size: 0.8rem;
}

.breadcrumb-current {
  color: var(--sw);
  font-weight: 600;
  font-size: 0.9rem;
}

/* Section Progress */
.section-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  width: 100px;
  height: 4px;
  background: rgba(var(--mg-rgb), 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--sw);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-text {
  font-family: 'Oswald', sans-serif;
  font-size: 0.8rem;
  color: var(--t2);
  font-weight: 600;
  min-width: 40px;
}

/* Section Navigation */
.section-navigation {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
}

.nav-container {
  display: flex;
  align-items: center;
  gap: 20px;
  background: linear-gradient(
    180deg,
    rgba(var(--panel-main-rgb), 0.95) 0%,
    rgba(var(--panel-dark-rgb), 0.98) 100%
  );
  backdrop-filter: blur(15px);
  border: 1px solid var(--divider-strong);
  border-radius: 50px;
  padding: 12px 20px;
  box-shadow: 0 12px 32px rgba(4, 9, 14, 0.6);
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: transparent;
  border: none;
  color: var(--t2);
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 25px;
  font-family: 'Rajdhani', sans-serif;
}

.nav-btn:hover {
  background: rgba(var(--sw-rgb), 0.1);
  color: var(--sw);
  transform: translateY(-1px);
}

.nav-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.nav-next .nav-content {
  align-items: flex-end;
  text-align: right;
}

.nav-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.8;
  font-weight: 500;
}

.nav-title {
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Quick Navigation */
.quick-nav {
  display: flex;
  gap: 8px;
  align-items: center;
}

.quick-nav-btn {
  width: 12px;
  height: 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 50%;
  position: relative;
  transition: transform 0.3s ease;
}

.quick-nav-btn:hover {
  transform: scale(1.2);
}

.quick-nav-dot {
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(var(--t3-rgb), 0.5);
  transition: all 0.3s ease;
}

.quick-nav-btn.active .quick-nav-dot {
  background: var(--sw);
  box-shadow: 0 0 8px rgba(var(--sw-rgb), 0.6);
  transform: scale(1.2);
}

.quick-nav-btn:hover .quick-nav-dot {
  background: var(--sw);
}

/* Back to Top Button */
.back-to-top-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: linear-gradient(180deg, rgba(var(--sw-rgb), 0.9) 0%, rgba(var(--sw-rgb), 0.7) 100%);
  border: 1px solid rgba(var(--sw-rgb), 0.5);
  border-radius: 50%;
  color: var(--ink);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  z-index: 150;
  box-shadow: 0 8px 24px rgba(var(--sw-rgb), 0.3);
}

.back-to-top-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 12px 32px rgba(var(--sw-rgb), 0.4);
}

.back-to-top-btn:active {
  transform: translateY(0) scale(0.95);
}

/* Transitions */
.back-to-top-enter-active,
.back-to-top-leave-active {
  transition: all 0.3s ease;
}

.back-to-top-enter-from,
.back-to-top-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

/* Responsive Design */
@media (max-width: 768px) {
  .breadcrumb-content {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  .section-navigation {
    bottom: 20px;
  }

  .nav-container {
    padding: 10px 16px;
    gap: 12px;
  }

  .nav-btn {
    padding: 6px 8px;
  }

  .nav-title {
    max-width: 80px;
    font-size: 0.8rem;
  }

  .nav-label {
    font-size: 0.65rem;
  }

  .progress-bar {
    width: 80px;
  }

  .back-to-top-btn {
    width: 45px;
    height: 45px;
    bottom: 20px;
    right: 20px;
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .nav-container {
    gap: 8px;
    padding: 8px 12px;
  }

  .nav-btn {
    padding: 4px 6px;
  }

  .nav-title {
    max-width: 60px;
    font-size: 0.75rem;
  }

  .quick-nav {
    gap: 6px;
  }

  .quick-nav-btn {
    width: 10px;
    height: 10px;
  }

  .quick-nav-dot {
    width: 6px;
    height: 6px;
  }

  .progress-bar {
    width: 60px;
  }

  .progress-text {
    font-size: 0.75rem;
  }
}
</style>
