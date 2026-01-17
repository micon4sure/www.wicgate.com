<script setup lang="ts">
import { useHead } from '@unhead/vue';
import Login from '../../views/Login.vue';

useHead({
  title: 'WICGATE | Admin Login',
  meta: [
    { key: 'description', name: 'description', content: 'Admin login for WICGATE' },
    { name: 'robots', content: 'noindex, nofollow' },
  ],
});
</script>

<template>
  <Login mode="admin" />
</template>
