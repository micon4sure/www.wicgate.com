<script setup lang="ts">
import { useHead } from '@unhead/vue';
import UserAdmin from '../../views/UserAdmin.vue';

useHead({
  title: 'WICGATE | Account Panel',
  meta: [
    { key: 'description', name: 'description', content: 'Manage your WICGATE account' },
    { name: 'robots', content: 'noindex, nofollow' },
  ],
});
</script>

<template>
  <UserAdmin />
</template>
