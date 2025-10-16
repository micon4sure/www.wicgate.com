<script setup lang="ts">
import { computed, inject, ref } from 'vue';

interface Props {
  rank?: number | string | null;
  size?: number; // px size for the image height (width auto)
}

const props = withDefaults(defineProps<Props>(), {
  rank: 0,
  size: 20,
});
const errored = ref(false);

const rankNum = computed(() => {
  const n = typeof props.rank === 'string' ? parseInt(props.rank, 10) : (props.rank ?? 0);
  const v = Number.isFinite(n as number) ? Math.max(0, Math.trunc(n as number)) : 0;
  return v;
});

const code = computed(() => String(rankNum.value).padStart(2, '0'));
// Base path for assets; provided by app (see main.ts). Fallback to '/'.
const appBase = inject<string>('appBase', '/');
const src = computed(() => {
  const base = appBase.endsWith('/') ? appBase : appBase + '/';
  return errored.value ? `${base}rank-00.png` : `${base}rank-${code.value}.png`;
});

function onErr() {
  // Any failure falls back to 00
  if (!errored.value) errored.value = true;
}
</script>

<template>
  <img
    :src="src"
    :alt="`Rank ${rankNum}`"
    :title="`Rank ${rankNum}`"
    class="inline-block align-middle"
    decoding="async"
    :style="{ height: `${size}px`, imageRendering: 'auto' }"
    @error="onErr"
  />
</template>
