<script setup lang="ts">
import type { LeaderboardEntry } from '../composables/useAppData';
import { ref, computed } from 'vue';

const props = defineProps<{ data: Record<string, LeaderboardEntry[] | undefined> }>();
const highTab = ref('overall');
const totalTab = ref('overall');
const categories = ['overall','infantry','armor','air','support'] as const;
const mapKey: Record<string,string> = { overall:'lb_high', infantry:'lb_highinf', armor:'lb_higharm', air:'lb_highair', support:'lb_highsup' };
const mapTotalKey: Record<string,string> = { overall:'lb_total', infantry:'lb_totalinf', armor:'lb_totalarm', air:'lb_totalair', support:'lb_totalsup' } as any;

function rows(list?: LeaderboardEntry[]) { return (list||[]).slice(0,10); }
const ladder = computed(()=> props.data.ladder || []);
</script>
<template>
  <div class="g g2 mb4">
    <!-- High Scores -->
    <div class="lb-cont">
      <div class="lb-hdr"><h3>High Scores</h3><p class="sm t3" style="margin:5px 0 0 0">Best individual match performances</p></div>
      <div class="tabs">
        <button v-for="c in categories" :key="c" class="tab-btn" :class="{active: highTab===c}" @click="highTab=c">{{ c[0].toUpperCase()+c.slice(1) }}</button>
      </div>
      <div v-for="c in categories" :key="'hc-'+c" class="tab-cont" :class="{active: highTab===c}">
        <table class="lb-table"><thead><tr><th>Rank</th><th>Player</th><th>Score</th></tr></thead><tbody>
          <tr v-if="rows(props.data[mapKey[c]]).length===0"><td colspan="3" class="t2">No data</td></tr>
          <tr v-for="e in rows(props.data[mapKey[c]])" :key="e.rank + (e.profileName||'')" :class="e.rank && e.rank<=3 ? 'rank-'+e.rank : ''">
            <td class="rank-cell">{{ e.rank }}</td><td>{{ e.profileName || e.shortName || e.tagFormat || 'Unknown' }}</td><td>{{ e.high?.toLocaleString?.() }}</td>
          </tr>
        </tbody></table>
      </div>
    </div>
    <!-- Total Scores -->
    <div class="lb-cont">
      <div class="lb-hdr"><h3>Total Scores</h3><p class="sm t3" style="margin:5px 0 0 0">Cumulative career scores</p></div>
      <div class="tabs">
        <button v-for="c in categories" :key="c" class="tab-btn" :class="{active: totalTab===c}" @click="totalTab=c">{{ c[0].toUpperCase()+c.slice(1) }}</button>
      </div>
      <div v-for="c in categories" :key="'tc-'+c" class="tab-cont" :class="{active: totalTab===c}">
        <table class="lb-table"><thead><tr><th>Rank</th><th>Player</th><th>Score</th></tr></thead><tbody>
          <tr v-if="rows(props.data[mapTotalKey[c]]).length===0"><td colspan="3" class="t2">No data</td></tr>
          <tr v-for="e in rows(props.data[mapTotalKey[c]])" :key="e.rank + (e.profileName||'')" :class="e.rank && e.rank<=3 ? 'rank-'+e.rank : ''">
            <td class="rank-cell">{{ e.rank }}</td><td>{{ e.profileName || e.shortName || e.tagFormat || 'Unknown' }}</td><td>{{ e.high?.toLocaleString?.() }}</td>
          </tr>
        </tbody></table>
      </div>
    </div>
    <!-- Player Ladder -->
    <div class="lb-cont">
      <div class="lb-hdr"><h3>Player Leaderboard</h3></div>
      <table class="lb-table"><thead><tr><th>Rank</th><th>Player</th><th>Rating</th></tr></thead><tbody>
        <tr v-if="ladder.length===0"><td colspan="3" class="t2">No data</td></tr>
        <tr v-for="e in rows(ladder)" :key="e.rank + (e.profileName||'')" :class="e.rank && e.rank<=3 ? 'rank-'+e.rank : ''">
          <td class="rank-cell">{{ e.rank }}</td><td>{{ e.profileName || e.shortName || e.tagFormat || 'Unknown' }}</td><td>{{ e.high?.toLocaleString?.() }}</td>
        </tr>
      </tbody></table>
    </div>
    <!-- Clan Leaderboard Placeholder -->
    <div class="lb-cont"><div class="lb-hdr"><h3>Clan Leaderboard</h3></div><div style="padding:20px;text-align:center;color:var(--t2)">Coming soon</div></div>
  </div>
</template>
<style scoped>
/* inherits global */
</style>
