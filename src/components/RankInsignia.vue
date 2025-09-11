<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  rank?: number | string | null
  size?: number // px size for the image height (width auto)
}

const props = withDefaults(defineProps<Props>(), { size: 20 })
const errored = ref(false)

const rankNum = computed(() => {
  const n = typeof props.rank === 'string' ? parseInt(props.rank, 10) : (props.rank ?? 0)
  const v = Number.isFinite(n as number) ? Math.max(0, Math.trunc(n as number)) : 0
  return v
})

const code = computed(() => String(rankNum.value).padStart(2, '0'))
const src = computed(() => (errored.value ? `/rank-00.png` : `/rank-${code.value}.png`))

function onErr() {
  // Any failure falls back to 00
  if (!errored.value) errored.value = true
}
</script>

<template>
  <img
    :src="src"
    :alt="`Rank ${rankNum}`"
    :title="`Rank ${rankNum}`"
    class="rank-insignia"
    decoding="async"
    @error="onErr"
    :style="{ height: `${size}px` }"
  />
  
</template>

<style scoped>
.rank-insignia { display: inline-block; vertical-align: middle; image-rendering: auto; }
</style>
