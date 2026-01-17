<script setup lang="ts">
import { useHead } from '@unhead/vue';
import Admin from '../../views/Admin.vue';
import { PAGE_META } from '../../content/pageMeta';

const meta = PAGE_META['/admin']!;

useHead({
  title: meta.title,
  meta: [
    { key: 'description', name: 'description', content: meta.description },
    { name: 'robots', content: meta.robots || 'noindex, nofollow' },
  ],
});
</script>

<template>
  <Admin />
</template>
