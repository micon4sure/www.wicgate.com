<script setup lang="ts">
const year = new Date().getFullYear();
</script>
<template>
  <footer
    class="bg-[var(--bg)] pt-10 pb-5 px-5 border-t border-[var(--bd)] text-center text-[var(--t3)] text-[0.9rem]"
  >
    <div>
      <span
        class="w-2 h-2 rounded-full inline-block mr-[5px] bg-[var(--g)] status-indicator always-animate"
      />
      WICGATE Servers Online • © {{ year }} WICGATE Community • Not affiliated with Ubisoft or
      Massive Entertainment
    </div>
  </footer>
</template>
