<script setup lang="ts">
import UserAdmin from '~/screens/UserAdmin.vue';
import { usePageSeo } from '~/composables/usePageSeo';

// Page meta for route - CSR only, requires user auth
definePageMeta({
  name: 'user',
  middleware: ['auth-user'],
  layout: false, // User panel has its own layout
});

// SEO
usePageSeo({
  title: 'WICGATE | Account Panel',
  description: 'Manage your WICGATE account',
  robots: 'noindex, nofollow',
});
</script>

<template>
  <UserAdmin />
</template>
