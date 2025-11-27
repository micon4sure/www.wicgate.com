<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import type { LoginCredentials } from '../types/auth';

const props = withDefaults(
  defineProps<{
    mode?: 'user' | 'admin';
  }>(),
  {
    mode: 'user',
  }
);

const router = useRouter();
const authStore = useAuthStore();

const username = ref('');
const password = ref('');
const showPassword = ref(false);

const isLoading = computed(() => authStore.loading);
const errorMessage = computed(() => authStore.error);

const isAdminMode = computed(() => props.mode === 'admin');
const loginLabel = computed(() => (isAdminMode.value ? 'Username' : 'Email'));
const loginPlaceholder = computed(() =>
  isAdminMode.value ? 'Enter admin username' : 'Enter your email'
);
const pageTitle = computed(() => (isAdminMode.value ? 'Admin Login' : 'User Login'));

async function handleLogin() {
  if (!username.value || !password.value) {
    authStore.error = 'Please enter both username and password';
    return;
  }

  const credentials: LoginCredentials = {
    username: username.value,
    password: password.value,
  };

  try {
    if (isAdminMode.value) {
      await authStore.loginAdmin(credentials);
      router.push('/admin');
    } else {
      await authStore.loginUser(credentials);
      router.push('/user');
    }
  } catch (e) {
    console.error('Login failed:', e);
  }
}

function handleKeyPress(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    handleLogin();
  }
}
</script>

<template>
  <div class="min-h-screen bg-texture-dark flex items-center justify-center p-5">
    <div
      class="w-full max-w-md bg-gradient-to-br from-texture-panel/95 to-texture-dark/95 border-2 border-massgate-red/85 rounded-none p-8 shadow-massgate-glow"
    >
      <!-- Header -->
      <div class="text-center mb-8">
        <h1
          class="font-military text-3xl font-bold text-massgate-red-bright uppercase tracking-[2px] mb-2"
          style="
            text-shadow:
              0 0 20px rgba(229, 53, 53, 0.5),
              0 0 40px rgba(198, 40, 40, 0.3);
          "
        >
          WICGATE
        </h1>
        <p class="font-body text-sm text-battlefield-mist uppercase tracking-wide">
          {{ pageTitle }}
        </p>
      </div>

      <!-- Error Message -->
      <div
        v-if="errorMessage"
        class="mb-6 p-4 bg-massgate-red-dark/30 border border-massgate-red-bright/50 text-massgate-red-bright text-sm font-body"
      >
        {{ errorMessage }}
      </div>

      <!-- Login Form -->
      <form class="space-y-6" @submit.prevent="handleLogin">
        <!-- Username -->
        <div>
          <label
            for="username"
            class="block text-sm font-semibold text-battlefield-mist mb-2 font-body uppercase tracking-wide"
          >
            {{ loginLabel }}
          </label>
          <input
            id="username"
            v-model="username"
            type="text"
            autocomplete="username"
            :disabled="isLoading"
            class="w-full bg-texture-dark/80 border-2 border-massgate-red/60 text-t p-3 font-body focus:outline-none focus:border-massgate-red-bright focus:shadow-massgate-border transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            :placeholder="loginPlaceholder"
            @keypress="handleKeyPress"
          />
        </div>

        <!-- Password -->
        <div>
          <label
            for="password"
            class="block text-sm font-semibold text-battlefield-mist mb-2 font-body uppercase tracking-wide"
          >
            Password
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              :disabled="isLoading"
              class="w-full bg-texture-dark/80 border-2 border-massgate-red/60 text-t p-3 pr-12 font-body focus:outline-none focus:border-massgate-red-bright focus:shadow-massgate-border transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter password"
              @keypress="handleKeyPress"
            />
            <button
              type="button"
              :disabled="isLoading"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-battlefield-mist hover:text-massgate-red-bright transition-colors duration-300 disabled:opacity-50"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-gradient-to-br from-massgate-red to-massgate-red-dark text-white font-military text-lg uppercase tracking-wider py-3 px-6 border-2 border-massgate-red-bright transition-all duration-300 hover:bg-massgate-header-shine hover:shadow-massgate-glow-intense hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          <span v-if="isLoading">
            <i class="fa-solid fa-spinner fa-spin mr-2"></i>
            Logging in...
          </span>
          <span v-else>Login</span>
        </button>
      </form>

      <!-- Back to Home -->
      <div class="mt-6 text-center">
        <router-link
          to="/"
          class="text-sm text-teal hover:text-teal-bright transition-colors duration-300 font-body uppercase tracking-wide"
        >
          <i class="fa-solid fa-arrow-left mr-2"></i>
          Back to Home
        </router-link>
      </div>
    </div>
  </div>
</template>
