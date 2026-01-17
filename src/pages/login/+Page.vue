<script setup lang="ts">
import { useHead } from '@unhead/vue';
import Login from '../../views/Login.vue';
import { PAGE_META } from '../../content/pageMeta';

const meta = PAGE_META['/login']!;

useHead({
  title: meta.title,
  meta: [
    { key: 'description', name: 'description', content: meta.description },
    { name: 'robots', content: meta.robots || 'noindex, nofollow' },
  ],
});
</script>

<template>
  <Login mode="user" />
</template>
