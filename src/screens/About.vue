<script setup lang="ts">
import { aboutProject, teamMembers, projectValues } from '../content/content';
</script>

<template>
  <section id="about" class="bg-[var(--s1)] section">
    <div class="container">
      <div class="text-center mb-xl">
        <h2>About WICGATE</h2>
        <p class="section-lead">
          Preserving World in Conflict multiplayer for current and future generations
        </p>
      </div>

      <!-- Project Mission -->
      <div id="about-mission" class="text-center max-w-[800px] mx-auto mb-xl">
        <div>
          <h3
            class="mb-4 text-2xl text-[var(--t)] font-[Oswald,sans-serif] font-semibold uppercase tracking-wider"
          >
            Our Mission
          </h3>
          <p class="text-[1.1rem] leading-relaxed text-[var(--t2)] m-0 pb-6">
            {{ aboutProject.mission }}
          </p>
        </div>
      </div>

      <!-- Project Story -->
      <div id="about-story" class="mb-xl">
        <div class="grid grid-2 gap-10 items-start max-[768px]:grid-cols-1 max-[768px]:gap-6">
          <div
            class="bg-gradient-to-b from-[rgba(var(--panel-main-rgb),0.96)] to-[rgba(var(--panel-dark-rgb),0.98)] border border-[var(--divider-strong)] p-7 relative shadow-[0_0_20px_rgba(var(--mg-rgb),0.2),inset_0_1px_0_rgba(255,255,255,0.1)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-[rgba(var(--sw-rgb),0.7)] after:to-transparent max-[768px]:p-5 max-[480px]:p-4"
          >
            <h3
              class="m-0 mb-4 text-[1.3rem] text-[var(--t)] font-[Oswald,sans-serif] font-semibold uppercase tracking-wider"
            >
              The Story
            </h3>
            <p class="m-0 leading-relaxed text-[var(--t2)]">{{ aboutProject.story }}</p>
          </div>
          <div
            class="bg-gradient-to-b from-[rgba(var(--panel-main-rgb),0.96)] to-[rgba(var(--panel-dark-rgb),0.98)] border border-[var(--divider-strong)] p-7 relative shadow-[0_0_20px_rgba(var(--mg-rgb),0.2),inset_0_1px_0_rgba(255,255,255,0.1)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-[rgba(var(--sw-rgb),0.7)] after:to-transparent max-[768px]:p-5 max-[480px]:p-4"
          >
            <h3
              class="m-0 mb-4 text-[1.3rem] text-[var(--t)] font-[Oswald,sans-serif] font-semibold uppercase tracking-wider"
            >
              Our Approach
            </h3>
            <p class="m-0 leading-relaxed text-[var(--t2)]">{{ aboutProject.approach }}</p>
          </div>
        </div>
      </div>

      <!-- Project Values -->
      <div id="about-values" class="mb-xl">
        <h3 class="text-center mb-lg font-[Oswald,sans-serif] font-bold uppercase tracking-[1.5px]">
          What Drives Us
        </h3>
        <div class="grid grid-2 gap-6 max-[1024px]:grid-cols-1 max-[1024px]:gap-5">
          <div
            v-for="value in projectValues"
            :key="value.title"
            class="bg-gradient-to-b from-[rgba(var(--panel-main-rgb),0.96)] to-[rgba(var(--panel-dark-rgb),0.98)] border border-[var(--divider-strong)] border-t-[3px] border-t-[rgba(var(--sw-rgb),0.8)] overflow-hidden relative text-center p-8 px-6 shadow-[0_0_20px_rgba(var(--mg-rgb),0.2),inset_0_1px_0_rgba(255,255,255,0.1)] max-[768px]:p-6 max-[768px]:px-5"
          >
            <div
              class="w-[60px] h-[60px] bg-gradient-to-br from-[rgba(var(--sw-rgb),0.95)] to-[rgba(var(--sw-rgb),0.75)] border border-[rgba(var(--sw-rgb),0.8)] flex items-center justify-center mx-auto mb-5 text-2xl text-[var(--ink)] shadow-[0_6px_20px_rgba(var(--sw-rgb),0.35),inset_0_1px_0_rgba(255,255,255,0.2)] font-bold max-[480px]:w-[50px] max-[480px]:h-[50px] max-[480px]:text-[1.3rem] max-[480px]:mb-4"
            >
              <i
                :class="value.icon"
                aria-hidden="true"
                class="drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
              ></i>
            </div>
            <h4
              class="m-0 mb-3 text-[1.2rem] text-[var(--t)] font-[Oswald,sans-serif] font-semibold uppercase tracking-wider"
            >
              {{ value.title }}
            </h4>
            <p class="m-0 leading-normal text-[var(--t2)]">{{ value.description }}</p>
          </div>
        </div>
      </div>

      <!-- Team Members -->
      <div id="about-team">
        <h3 class="text-center mb-lg font-[Oswald,sans-serif] font-bold uppercase tracking-[1.5px]">
          The Team
        </h3>
        <div class="grid grid-3 gap-6 max-[768px]:grid-cols-1 max-[768px]:gap-5">
          <div
            v-for="member in teamMembers"
            :key="member.name"
            class="bg-gradient-to-b from-[rgba(var(--panel-main-rgb),0.96)] to-[rgba(var(--panel-dark-rgb),0.98)] border border-[var(--divider-strong)] border-l-[3px] border-l-[rgba(var(--sw-rgb),0.6)] overflow-hidden relative text-center p-7 px-6 shadow-[0_0_20px_rgba(var(--mg-rgb),0.2),inset_0_1px_0_rgba(255,255,255,0.1)] max-[768px]:p-6 max-[768px]:px-5"
          >
            <div>
              <h4
                class="m-0 mb-2 text-[1.3rem] text-[var(--t)] font-[Oswald,sans-serif] font-semibold uppercase tracking-wider"
              >
                {{ member.name }}
              </h4>
              <div
                class="text-[0.9rem] text-[var(--sw)] font-semibold mb-4 uppercase tracking-[0.02em] font-[Oswald,sans-serif]"
              >
                {{ member.role }}
              </div>
              <p class="m-0 leading-normal text-[var(--t2)]">{{ member.description }}</p>
            </div>
          </div>
        </div>
        <div class="mt-10 text-center">
          <p class="text-muted">
            Want to contribute? Join our
            <a
              href="https://discord.gg/WnxwfMTyBe"
              target="_blank"
              rel="noopener noreferrer"
              class="text-[var(--sw)] no-underline transition-all hover:text-[var(--sw)] hover:underline"
              >Discord community</a
            >
            and help us keep World in Conflict alive!
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
