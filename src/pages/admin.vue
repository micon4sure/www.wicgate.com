<script setup lang="ts">
import Admin from '~/views/Admin.vue';
import { usePageSeo } from '~/composables/usePageSeo';

// Page meta for route - CSR only, requires admin auth
definePageMeta({
  name: 'admin',
  middleware: ['auth-admin'],
  layout: false, // Admin has its own layout
});

// SEO
usePageSeo({
  title: 'WICGATE | Admin Dashboard',
  description: 'WICGATE admin dashboard',
  robots: 'noindex, nofollow',
});
</script>

<template>
  <Admin />
</template>
