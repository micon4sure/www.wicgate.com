<script setup lang="ts">
defineProps<{
  currentSection?: string;
}>();

const emit = defineEmits<{
  goHome: [];
  continue: [];
  close: [];
}>();

function getSectionDisplayName(section?: string) {
  switch (section) {
    case 'getting-started':
      return 'Getting Started';
    case 'statistics':
      return 'Statistics';
    case 'community':
      return 'Community';
    case 'faq':
      return 'FAQ';
    case 'gamemode':
      return 'Game Mode Dashboard';
    default:
      return 'a specific section';
  }
}
</script>

<template>
  <div class="first-visit-overlay">
    <div class="overlay-backdrop" @click="emit('close')"></div>
    <div class="overlay-card">
      <div class="overlay-header">
        <h2><i class="fa-solid fa-hand-wave" aria-hidden="true"></i> Welcome to WiCGate!</h2>
        <button class="overlay-close" title="Close" @click="emit('close')">×</button>
      </div>

      <div class="overlay-content">
        <p class="overlay-intro">
          It looks like this is your first time visiting WiCGate - the community-driven multiplayer
          platform for World in Conflict.
        </p>

        <div v-if="currentSection" class="overlay-section-info">
          <p>
            You've been directed to <strong>{{ getSectionDisplayName(currentSection) }}</strong
            >. Would you like to start from the beginning to learn what WiCGate is about?
          </p>
        </div>

        <div class="overlay-actions">
          <button class="btn btn-p" @click="emit('goHome')">
            <i class="fa-solid fa-house" aria-hidden="true"></i> Take me to the homepage
          </button>
          <button class="btn btn-secondary" @click="emit('continue')">
            {{
              currentSection
                ? 'Continue to ' + getSectionDisplayName(currentSection)
                : 'Continue browsing'
            }}
          </button>
        </div>

        <div class="overlay-footer">
          <p class="overlay-subtitle">
            WiCGate brings World in Conflict multiplayer back to life with official Massgate server
            code.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.first-visit-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.overlay-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
}

.overlay-card {
  position: relative;
  background: var(--grad-card);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 0;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.overlay-header {
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.overlay-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--t);
}

.overlay-close {
  background: none;
  border: none;
  color: var(--t2);
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
  line-height: 1;
}

@media (hover: hover) {
  .overlay-close:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--t);
  }
}

.overlay-close:active {
  transform: scale(0.9);
  background: rgba(255, 0, 0, 0.15);
  color: var(--t);
}

.overlay-content {
  padding: 24px;
}

.overlay-intro {
  color: var(--t2);
  line-height: 1.6;
  margin-bottom: 20px;
  font-size: 1rem;
}

.overlay-section-info {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  border-left: 3px solid var(--mg);
}

.overlay-section-info p {
  margin: 0;
  color: var(--t);
  line-height: 1.5;
}

.overlay-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--t2);
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  font-weight: 500;
  flex: 1;
  text-align: center;
  font-size: 14px;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  color: var(--t);
  border-color: rgba(255, 255, 255, 0.3);
}

.overlay-actions .btn {
  flex: 1;
  justify-content: center;
  min-width: 0;
}

.overlay-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 16px;
}

.overlay-subtitle {
  color: var(--t3);
  font-size: 0.9rem;
  text-align: center;
  margin: 0;
  line-height: 1.4;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .overlay-card {
    margin: 10px;
    max-width: none;
  }

  .overlay-header,
  .overlay-content {
    padding: 20px;
  }

  .overlay-actions {
    flex-direction: column;
  }

  .overlay-actions .btn,
  .btn-secondary {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .overlay-header,
  .overlay-content {
    padding: 16px;
  }

  .overlay-header h2 {
    font-size: 1.3rem;
  }
}
</style>
