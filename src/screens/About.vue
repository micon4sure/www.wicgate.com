<script setup lang="ts">
import { aboutProject, teamMembers, projectValues } from '../content/content';
</script>

<template>
  <section id="about" class="section bg-gradient-to-b from-graphite/30 to-graphite-dark/50">
    <div class="container max-w-6xl">
      <!-- Header -->
      <div class="text-center mb-20">
        <h2
          class="text-5xl md:text-6xl font-military font-bold text-t uppercase tracking-wider mb-6"
        >
          About WICGATE
        </h2>
        <p class="text-lg md:text-xl text-t-secondary max-w-2xl mx-auto font-body leading-relaxed">
          Preserving World in Conflict multiplayer for current and future generations
        </p>
      </div>

      <!-- Project Mission -->
      <div id="about-mission" class="mb-20">
        <div
          class="bg-gradient-to-br from-graphite-light/80 to-graphite-dark/90 border-2 border-teal/40 rounded-none p-8 md:p-12 text-center max-w-4xl mx-auto relative overflow-hidden"
        >
          <!-- Decorative gradient line -->
          <div
            class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal/70 to-transparent"
          ></div>

          <div class="flex justify-center mb-6">
            <div
              class="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-teal/30 to-teal/10 border-3 border-teal flex items-center justify-center"
            >
              <i class="fa-solid fa-bullseye text-teal text-3xl md:text-4xl" aria-hidden="true"></i>
            </div>
          </div>

          <h3
            class="text-2xl md:text-3xl font-military font-bold text-t uppercase tracking-wider mb-6"
          >
            Our Mission
          </h3>
          <p class="text-lg md:text-xl text-t-secondary font-body leading-relaxed m-0">
            {{ aboutProject.mission }}
          </p>
        </div>
      </div>

      <!-- Project Story + Approach -->
      <div id="about-story" class="mb-20">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- The Story Card -->
          <div
            class="bg-gradient-to-br from-graphite-light/80 to-graphite-dark/90 border-2 border-teal/30 border-l-4 border-l-teal/70 rounded-none p-6 md:p-8 relative"
          >
            <div class="flex items-center gap-4 mb-6">
              <div
                class="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-teal/30 to-teal/10 border-2 border-teal flex items-center justify-center flex-shrink-0"
              >
                <i class="fa-solid fa-book text-teal text-xl md:text-2xl" aria-hidden="true"></i>
              </div>
              <h3
                class="text-2xl md:text-3xl font-military font-bold text-t uppercase tracking-wide"
              >
                The Story
              </h3>
            </div>
            <p class="text-base md:text-lg text-t-secondary font-body leading-relaxed m-0">
              {{ aboutProject.story }}
            </p>
          </div>

          <!-- Our Approach Card -->
          <div
            class="bg-gradient-to-br from-graphite-light/80 to-graphite-dark/90 border-2 border-teal/30 border-l-4 border-l-teal/70 rounded-none p-6 md:p-8 relative"
          >
            <div class="flex items-center gap-4 mb-6">
              <div
                class="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-teal/30 to-teal/10 border-2 border-teal flex items-center justify-center flex-shrink-0"
              >
                <i
                  class="fa-solid fa-lightbulb text-teal text-xl md:text-2xl"
                  aria-hidden="true"
                ></i>
              </div>
              <h3
                class="text-2xl md:text-3xl font-military font-bold text-t uppercase tracking-wide"
              >
                Our Approach
              </h3>
            </div>
            <p class="text-base md:text-lg text-t-secondary font-body leading-relaxed m-0">
              {{ aboutProject.approach }}
            </p>
          </div>
        </div>
      </div>

      <!-- Project Values -->
      <div id="about-values" class="mb-20">
        <div class="text-center mb-12">
          <h3
            class="text-3xl md:text-4xl font-military font-bold text-t uppercase tracking-wider mb-4"
          >
            What Drives Us
          </h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="value in projectValues"
            :key="value.title"
            class="bg-gradient-to-br from-graphite-light/80 to-graphite-dark/90 border-2 border-teal/30 border-t-4 border-t-teal/70 rounded-none p-8 text-center relative"
          >
            <div class="flex justify-center mb-6">
              <div
                class="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-teal/30 to-teal/10 border-3 border-teal flex items-center justify-center"
              >
                <i
                  :class="value.icon"
                  class="text-teal text-2xl md:text-3xl"
                  aria-hidden="true"
                ></i>
              </div>
            </div>
            <h4
              class="text-xl md:text-2xl font-military font-bold text-t uppercase tracking-wider mb-4"
            >
              {{ value.title }}
            </h4>
            <p class="text-base md:text-lg text-t-secondary font-body leading-relaxed m-0">
              {{ value.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Team Members -->
      <div id="about-team">
        <div class="text-center mb-12">
          <h3
            class="text-3xl md:text-4xl font-military font-bold text-t uppercase tracking-wider mb-4"
          >
            The Team
          </h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div
            v-for="member in teamMembers"
            :key="member.name"
            class="bg-gradient-to-br from-graphite-light/80 to-graphite-dark/90 border-2 border-teal/30 border-l-4 border-l-teal/70 rounded-none p-6 md:p-8 text-center"
          >
            <h4
              class="text-xl md:text-2xl font-military font-bold text-t uppercase tracking-wider mb-2"
            >
              {{ member.name }}
            </h4>
            <div
              class="text-base md:text-lg text-teal font-military font-semibold uppercase tracking-wider mb-4"
            >
              {{ member.role }}
            </div>
            <p class="text-sm md:text-base text-t-secondary font-body leading-relaxed m-0">
              {{ member.description }}
            </p>
          </div>
        </div>

        <!-- Join CTA -->
        <div
          class="bg-gradient-to-br from-graphite-light/80 to-graphite-dark/90 border-2 border-teal/40 rounded-none p-6 md:p-8 text-center max-w-3xl mx-auto"
        >
          <div class="flex justify-center mb-4">
            <div
              class="w-12 h-12 rounded-full bg-gradient-to-br from-teal/30 to-teal/10 border-2 border-teal flex items-center justify-center"
            >
              <i class="fa-brands fa-discord text-teal text-xl" aria-hidden="true"></i>
            </div>
          </div>
          <p class="text-base md:text-lg text-t-secondary font-body leading-relaxed m-0">
            Want to contribute? Join our
            <a
              href="https://discord.gg/WnxwfMTyBe"
              target="_blank"
              rel="noopener noreferrer"
              class="text-teal font-semibold no-underline transition-all duration-200 hover:text-teal-bright hover:underline"
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
