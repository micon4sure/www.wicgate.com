<script setup lang="ts">
import { aboutProject, teamMembers, projectValues } from '../content/content';
</script>

<template>
  <section id="about" class="about-bg section">
    <div class="container">
      <div class="text-center mb-xl">
        <h2>About WICGATE</h2>
        <p class="section-lead">
          Preserving World in Conflict multiplayer for current and future generations
        </p>
      </div>

      <!-- Project Mission -->
      <div class="about-mission mb-xl">
        <div class="mission-content">
          <h3>Our Mission</h3>
          <p class="mission-text">{{ aboutProject.mission }}</p>
        </div>
      </div>

      <!-- Project Story -->
      <div class="about-story mb-xl">
        <div class="grid grid-2 about-grid">
          <div class="story-content">
            <h3>The Story</h3>
            <p>{{ aboutProject.story }}</p>
          </div>
          <div class="approach-content">
            <h3>Our Approach</h3>
            <p>{{ aboutProject.approach }}</p>
          </div>
        </div>
      </div>

      <!-- Project Values -->
      <div class="about-values mb-xl">
        <h3 class="text-center mb-lg">What Drives Us</h3>
        <div class="grid grid-2 values-grid">
          <div v-for="value in projectValues" :key="value.title" class="value-card">
            <div class="value-icon">
              <i :class="value.icon" aria-hidden="true"></i>
            </div>
            <h4>{{ value.title }}</h4>
            <p>{{ value.description }}</p>
          </div>
        </div>
      </div>

      <!-- Team Members -->
      <div class="about-team">
        <h3 class="text-center mb-lg">The Team</h3>
        <div class="grid grid-3 team-grid">
          <div v-for="member in teamMembers" :key="member.name" class="team-card">
            <div class="team-member-content">
              <h4>{{ member.name }}</h4>
              <div class="team-role">{{ member.role }}</div>
              <p>{{ member.description }}</p>
            </div>
          </div>
        </div>
        <div class="team-join text-center mt-lg">
          <p class="text-muted">
            Want to contribute? Join our
            <a
              href="https://discord.gg/WnxwfMTyBe"
              target="_blank"
              rel="noopener noreferrer"
              class="text-link"
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
