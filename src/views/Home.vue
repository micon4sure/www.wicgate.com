<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Navigation from '../components/Navigation.vue';
import PlayersOnline from '../components/PlayersOnline.vue';
import SiteFooter from '../components/Footer.vue';
import GettingStarted from './GettingStarted.vue';
import Statistics from './Statistics.vue';
import Community from './Community.vue';
import FAQ from './FAQ.vue';
import { useAppData } from '../composables/useAppData';

const { data, playerCount } = useAppData();
const panelRef = ref<InstanceType<typeof PlayersOnline> | null>(null);

interface Slide { icon: string; title: string; sub: string }
const slides: Slide[] = [
  { icon:'💥', title:'Massive Multiplayer Battles', sub:'16-player combined arms warfare' },
  { icon:'🚁', title:'Air Superiority', sub:'Command attack helicopters and air strikes' },
  { icon:'🛡️', title:'Armored Divisions', sub:'Lead heavy armor in breakthrough operations' },
  { icon:'🎯', title:'Tactical Support', sub:'Artillery, repair, and strategic coordination' },
  { icon:'🏆', title:'Competitive Tournaments', sub:'Weekly events and seasonal championships' }
];
const curSlide = ref(0);
let int: any;
function changeSlide(i:number){curSlide.value = i;resetInterval();}
function resetInterval(){clearInterval(int);int=setInterval(()=>{curSlide.value=(curSlide.value+1)%slides.length;},6000);} 
onMounted(()=>{resetInterval();});
onBeforeUnmount(()=>clearInterval(int));

function togglePlayers(){panelRef.value?.toggle();}
</script>
<template>
  <div class="site-wrapper" id="siteWrapper">
    <header>
      <Navigation :show-players-button="true" @toggle-players="togglePlayers">
        <template #player-count>{{ playerCount }}</template>
      </Navigation>
    </header>

    <!-- Hero -->
    <section class="hero" id="hero">
      <div class="hero-grid c">
        <div class="hero-content">
          <div class="hero-tag">The War Continues</div>
          <h1>World in Conflict<br>Lives Again</h1>
          <p>Join our community in epic Cold War battles. Fully restored multiplayer servers with the real Massgate code.</p>
          <div class="hero-acts">
            <a href="#getting-started" class="btn btn-p" @click.prevent="() => document.getElementById('getting-started')?.scrollIntoView({behavior:'smooth'})">↓ Download Client</a>
            <a href="https://discord.gg/wicgate" target="_blank" class="btn btn-d">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"/></svg>
              Join Discord
            </a>
          </div>
        </div>
        <div class="hero-vis">
          <div v-for="(s,i) in slides" :key="s.title" class="h-slide" :class="{ active: i===curSlide }">
            <div class="slide-cont">
              <div class="icon-ph">{{ s.icon }}</div>
              <h3>{{ s.title }}</h3>
              <p class="t2">{{ s.sub }}</p>
            </div>
          </div>
          <div class="slide-ind">
            <div v-for="(s,i) in slides" :key="s.title+'dot'" class="s-dot" :class="{ active: i===curSlide }" @click="changeSlide(i)" />
          </div>
        </div>
      </div>
    </section>

    <GettingStarted />
    <Statistics />
    <Community />
    <FAQ />
    <SiteFooter />
  </div>
  <PlayersOnline ref="panelRef" :players="data.profiles || []" />
</template>
<style scoped>
/* Section-specific overrides can live here */
</style>
