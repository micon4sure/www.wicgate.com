<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useAppDataStore } from '../stores/appDataStore';

const router = useRouter();
const authStore = useAuthStore();
const appDataStore = useAppDataStore();

const currentUser = computed(() => authStore.currentUser);
const isAdmin = computed(() => authStore.isAdmin);
const playerCount = computed(() => appDataStore.playerCount);
const playersOnline = computed(() => appDataStore.playersOnline);

function handleLogout() {
  authStore.logout();
  router.push('/');
}
</script>

<template>
  <div class="min-h-screen bg-texture-dark">
    <!-- Header -->
    <header
      class="sticky top-0 z-50 bg-gradient-to-br from-texture-panel/95 to-texture-dark/95 border-b-2 border-massgate-red-bright shadow-massgate-glow"
    >
      <div class="container mx-auto px-5 py-4 flex items-center justify-between">
        <router-link
          to="/"
          class="font-military text-2xl font-bold text-massgate-red-bright uppercase tracking-[2px] select-none hover:text-massgate-red-glow transition-colors duration-300"
          style="
            text-shadow:
              0 0 20px rgba(229, 53, 53, 0.5),
              0 0 40px rgba(198, 40, 40, 0.3);
          "
        >
          WICGATE
        </router-link>

        <div class="flex items-center gap-4">
          <div class="text-right">
            <p class="font-body text-sm text-battlefield-mist">
              Logged in as
              <span class="text-massgate-gold font-semibold">{{ currentUser?.username }}</span>
            </p>
            <p class="font-body text-xs text-t-dim uppercase tracking-wide">
              <i
                v-if="isAdmin"
                class="fa-solid fa-crown text-massgate-gold mr-1"
                aria-hidden="true"
              ></i>
              {{ currentUser?.role }}
            </p>
          </div>
          <button
            class="bg-gradient-to-br from-massgate-red to-massgate-red-dark text-white font-body text-sm uppercase tracking-wider py-2 px-4 border border-massgate-red-bright transition-all duration-300 hover:bg-massgate-header-shine hover:shadow-massgate-border hover:-translate-y-0.5 active:translate-y-0"
            @click="handleLogout"
          >
            <i class="fa-solid fa-right-from-bracket mr-2"></i>
            Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-5 py-8">
      <!-- Welcome Section -->
      <div
        class="mb-8 p-6 bg-gradient-to-br from-texture-panel/95 to-texture-dark/95 border-2 border-massgate-red/85 shadow-massgate-border"
      >
        <h1 class="font-military text-3xl font-bold text-t uppercase tracking-wider mb-2">
          <i class="fa-solid fa-shield-halved text-massgate-red-bright mr-3"></i>
          Admin Dashboard
        </h1>
        <p class="font-body text-battlefield-mist text-lg">
          Welcome back,
          <span class="text-massgate-gold font-semibold">{{ currentUser?.username }}</span
          >! You have full administrative access to the WICGATE system.
        </p>
      </div>

      <!-- MOCK AUTH WARNING -->
      <div
        class="mb-8 bg-massgate-red/15 border-2 border-massgate-red-bright rounded-lg p-4 flex gap-3 items-start shadow-massgate-border"
      >
        <i
          class="fa-solid fa-triangle-exclamation text-massgate-red-bright text-2xl flex-shrink-0"
          aria-hidden="true"
        ></i>
        <div>
          <h3 class="text-massgate-red-bright font-military font-bold uppercase text-lg mb-2 m-0">
            Mock Authentication Active
          </h3>
          <p class="text-t-secondary font-body text-sm leading-relaxed m-0">
            This is a demonstration using hardcoded credentials (admin/admin123).
            <strong class="text-massgate-red-bright">DO NOT use in production.</strong>
            Replace with proper authentication backend before deploying.
          </p>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <!-- Player Count Widget -->
        <div
          class="p-6 bg-gradient-to-br from-texture-panel/95 to-texture-dark/95 border-2 border-teal/60 hover:border-teal-bright transition-all duration-300 hover:shadow-teal-border"
        >
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-military text-xl uppercase tracking-wide text-t">Players Online</h2>
            <i class="fa-solid fa-users text-3xl text-teal" aria-hidden="true"></i>
          </div>
          <p class="font-body text-4xl font-bold text-teal-bright mb-2">
            {{ playerCount }}
          </p>
          <p class="font-body text-sm text-battlefield-mist uppercase tracking-wide">
            <i v-if="playersOnline" class="fa-solid fa-circle text-online mr-2 animate-pulse"></i>
            <i v-else class="fa-solid fa-circle text-t-dim mr-2"></i>
            {{ playersOnline ? 'Active' : 'Idle' }}
          </p>
        </div>

        <!-- Admin Status Widget -->
        <div
          class="p-6 bg-gradient-to-br from-texture-panel/95 to-texture-dark/95 border-2 border-massgate-gold/60 hover:border-massgate-gold-bright transition-all duration-300 hover:shadow-gold-glow"
        >
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-military text-xl uppercase tracking-wide text-t">Access Level</h2>
            <i class="fa-solid fa-crown text-3xl text-massgate-gold" aria-hidden="true"></i>
          </div>
          <p class="font-body text-4xl font-bold text-massgate-gold-bright mb-2 uppercase">
            {{ currentUser?.role }}
          </p>
          <p class="font-body text-sm text-battlefield-mist uppercase tracking-wide">
            <i class="fa-solid fa-circle-check text-online mr-2"></i>
            Full Permissions
          </p>
        </div>

        <!-- System Status Widget -->
        <div
          class="p-6 bg-gradient-to-br from-texture-panel/95 to-texture-dark/95 border-2 border-online/60 hover:border-online transition-all duration-300 hover:shadow-[0_0_20px_rgba(124,179,66,0.4)]"
        >
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-military text-xl uppercase tracking-wide text-t">System Status</h2>
            <i class="fa-solid fa-server text-3xl text-online" aria-hidden="true"></i>
          </div>
          <p class="font-body text-4xl font-bold text-online mb-2 uppercase">Operational</p>
          <p class="font-body text-sm text-battlefield-mist uppercase tracking-wide">
            <i class="fa-solid fa-circle text-online mr-2 animate-pulse"></i>
            All Services Online
          </p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div
        class="p-6 bg-gradient-to-br from-texture-panel/95 to-texture-dark/95 border-2 border-massgate-red/85 shadow-massgate-border"
      >
        <h2
          class="font-military text-2xl font-bold text-t uppercase tracking-wider mb-6 flex items-center"
        >
          <i class="fa-solid fa-bolt text-massgate-gold mr-3"></i>
          Quick Actions
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            class="p-4 bg-texture-dark/80 border-2 border-teal/60 text-teal hover:bg-teal/20 hover:border-teal-bright hover:shadow-teal-border transition-all duration-300 font-body uppercase tracking-wide text-left"
          >
            <i class="fa-solid fa-chart-line mr-3"></i>
            View Analytics
          </button>
          <button
            class="p-4 bg-texture-dark/80 border-2 border-massgate-red/60 text-massgate-red-bright hover:bg-massgate-red/20 hover:border-massgate-red-bright hover:shadow-massgate-border transition-all duration-300 font-body uppercase tracking-wide text-left"
          >
            <i class="fa-solid fa-user-gear mr-3"></i>
            Manage Users
          </button>
          <button
            class="p-4 bg-texture-dark/80 border-2 border-massgate-gold/60 text-massgate-gold hover:bg-massgate-gold/20 hover:border-massgate-gold-bright hover:shadow-gold-glow transition-all duration-300 font-body uppercase tracking-wide text-left"
          >
            <i class="fa-solid fa-cog mr-3"></i>
            System Settings
          </button>
        </div>
      </div>

      <!-- Placeholder Info -->
      <div class="mt-8 p-6 bg-texture-panel/60 border border-teal/30 text-center">
        <p class="font-body text-battlefield-mist text-sm">
          <i class="fa-solid fa-info-circle text-teal mr-2"></i>
          This is a placeholder admin dashboard. Future features will be added here.
        </p>
      </div>
    </main>
  </div>
</template>
