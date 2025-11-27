<script setup lang="ts">
import axios from 'axios';
import { computed, onMounted, ref, watch, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore, SERVER_URL } from '../stores/auth';

interface Server {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'queued';
  queue?: number;
}

interface Player {
  slot: number;
  role: string;
  score: number;
  name: string;
}

interface LogLine {
  level: 'LOG' | 'ERROR';
  content: string;
}

const router = useRouter();
const authStore = useAuthStore();

const token = computed(() => authStore.authToken);
const currentUser = computed(() => authStore.currentUser);

// Tab state
const activeTab = ref<'main-log' | 'server-log' | 'server-ini' | 'server-cycle' | 'remote-admin'>(
  'main-log'
);

// Data
const log = ref<string[]>([]);
const servers = ref<Server[]>([]);
const activeServer = ref<Server | null>(null);
const serverLog = ref<string[]>([]);
const serverIni = ref('');
const serverCycle = ref('');
const message = ref(' ');
const players = ref<Player[]>([]);
const remoteAdminOutput = ref<string[]>([]);

let remoteAdminWs: WebSocket | null = null;
let syncInterval: ReturnType<typeof setInterval>;

// Computed log with levels
const formattedLog = computed<LogLine[]>(() =>
  log.value.map((line) => ({
    level: line[0] === 'L' ? 'LOG' : 'ERROR',
    content: line.slice(2),
  }))
);

const datePrefix = () => '[' + new Date().toISOString().replace('Z', '').replace('T', ' ') + '] ';

// Server name colorizer
function colorize(serverName: string): string {
  let result = '<span style="color: #ddd">';
  let lastIndex = 0;
  let spanOpen = false;
  const regex = /<#([\da-f]{3,6})>|<\/>/gi;
  let match;
  while ((match = regex.exec(serverName)) !== null) {
    result += serverName.slice(lastIndex, match.index);
    lastIndex = regex.lastIndex;
    if (match[1]) {
      if (spanOpen) result += '</span>';
      result += `<span style="color: #${match[1]}">`;
      spanOpen = true;
    } else {
      if (spanOpen) {
        result += '</span>';
        spanOpen = false;
      }
    }
  }
  result += serverName.slice(lastIndex);
  if (spanOpen) result += '</span>';
  result += '</span>';
  return result;
}

function parseRemoteAdminResponse(input: string): Player | null {
  const regex = /Slot: (\d+) Role: ([A-Za-z]+) Score: (\d+) Name: (.+)/;
  const result = regex.exec(input);
  if (!result) return null;
  return {
    slot: Number(result[1]),
    role: result[2],
    score: Number(result[3]),
    name: result[4],
  };
}

// API Functions
async function fetchMainLog() {
  if (!token.value) return;
  const response = await axios.get(SERVER_URL + '/log', {
    headers: { Authorization: `Bearer ${token.value}` },
  });
  log.value = response.data.reverse();
}

async function fetchServers() {
  if (!token.value) return;
  const response = await axios.get(SERVER_URL + '/servers', {
    headers: { Authorization: `Bearer ${token.value}` },
  });
  servers.value = response.data;
}

async function fetchServerLog() {
  if (!activeServer.value || !token.value) return;
  const response = await axios.get(SERVER_URL + '/server-log/' + activeServer.value.id, {
    headers: { Authorization: `Bearer ${token.value}` },
  });
  serverLog.value = response.data.split('\n').reverse();
}

async function fetchServerIni() {
  if (!activeServer.value || !token.value) return;
  const response = await axios.get(SERVER_URL + '/server-ini/' + activeServer.value.id, {
    headers: { Authorization: `Bearer ${token.value}` },
  });
  serverIni.value = response.data.content;
}

async function fetchServerCycle() {
  if (!activeServer.value || !token.value) return;
  const response = await axios.get(SERVER_URL + '/server-cycle/' + activeServer.value.id, {
    headers: { Authorization: `Bearer ${token.value}` },
  });
  serverCycle.value = response.data.content;
}

async function saveIni() {
  if (!activeServer.value || !token.value) return;
  const response = await axios.post(
    SERVER_URL + '/server-ini/' + activeServer.value.id,
    { content: serverIni.value },
    { headers: { Authorization: `Bearer ${token.value}` } }
  );
  message.value = datePrefix() + response.data.message;
}

async function saveCycle() {
  if (!activeServer.value || !token.value) return;
  const response = await axios.post(
    SERVER_URL + '/server-cycle/' + activeServer.value.id,
    { content: serverCycle.value },
    { headers: { Authorization: `Bearer ${token.value}` } }
  );
  message.value = datePrefix() + response.data.message;
}

async function restartServer(serverId: string) {
  if (!token.value) return;
  await axios.post(
    SERVER_URL + '/server-restart/' + serverId,
    {},
    {
      headers: { Authorization: `Bearer ${token.value}` },
    }
  );
  sync();
}

async function stopServer(serverId: string) {
  if (!token.value) return;
  await axios.post(
    SERVER_URL + '/server-stop/' + serverId,
    {},
    {
      headers: { Authorization: `Bearer ${token.value}` },
    }
  );
  sync();
}

async function startServer(serverId: string) {
  if (!token.value) return;
  await axios.post(
    SERVER_URL + '/server-start/' + serverId,
    {},
    {
      headers: { Authorization: `Bearer ${token.value}` },
    }
  );
  sync();
}

async function refreshServers() {
  if (!token.value) return;
  await axios.post(
    SERVER_URL + '/refresh',
    {},
    {
      headers: { Authorization: `Bearer ${token.value}` },
    }
  );
  sync();
}

async function postRemoteAdminCommand(command: string) {
  if (!activeServer.value || !token.value) return;
  try {
    await axios.post(
      SERVER_URL + '/remote-admin',
      { serverId: activeServer.value.id, command },
      { headers: { Authorization: `Bearer ${token.value}` } }
    );
  } catch (error: unknown) {
    const axiosError = error as { message?: string };
    message.value = datePrefix() + axiosError.message;
  }
}

function connectRemoteAdmin() {
  remoteAdminOutput.value = [];
  if (remoteAdminWs) {
    remoteAdminWs.close();
    remoteAdminWs = null;
  }
  if (!activeServer.value) return;

  let wsUrl: string;
  if (import.meta.env.DEV) {
    // In dev mode, use the Vite proxy via current host
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    wsUrl = `${protocol}//${window.location.host}/admin-api/remote-admin/${activeServer.value.id}`;
  } else if (SERVER_URL.startsWith('https')) {
    wsUrl = SERVER_URL.replace('https', 'wss') + `/remote-admin/${activeServer.value.id}`;
  } else {
    wsUrl = SERVER_URL.replace('http', 'ws') + `/remote-admin/${activeServer.value.id}`;
  }

  remoteAdminWs = new WebSocket(wsUrl);
  remoteAdminWs.onopen = async () => {
    console.log('Connected to remote admin WebSocket');
    try {
      await axios.post(
        SERVER_URL + '/remote-admin',
        { serverId: activeServer.value!.id, command: '/listplayerslots' },
        { headers: { Authorization: `Bearer ${token.value}` } }
      );
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: string } } };
      message.value = datePrefix() + (axiosError.response?.data?.error || 'Error');
    }
  };
  remoteAdminWs.onmessage = (event) => {
    remoteAdminOutput.value.push(event.data);
    const player = parseRemoteAdminResponse(event.data);
    if (player) {
      players.value.push(player);
    }
  };
  remoteAdminWs.onerror = (error) => {
    console.error('Remote admin WebSocket error', error);
  };
  remoteAdminWs.onclose = () => {
    console.log('Remote admin WebSocket closed');
    remoteAdminWs = null;
  };
}

async function remoteAdminRefresh() {
  players.value = [];
  remoteAdminOutput.value = [];
  if (activeTab.value === 'remote-admin') {
    await postRemoteAdminCommand('/listplayerslots');
  }
}

function kick(slot: number) {
  postRemoteAdminCommand(`/kick ${slot}`);
  players.value = [];
  postRemoteAdminCommand('/listplayerslots');
}

async function sync() {
  if (!token.value) return;
  await fetchServers();
  if (activeTab.value === 'main-log') fetchMainLog();
  else if (activeTab.value === 'server-log') fetchServerLog();
}

function handleLogout() {
  authStore.logout();
  router.push('/');
}

// Watchers
watch(activeServer, (newVal) => {
  if (!newVal) return;
  if (activeTab.value === 'server-log') fetchServerLog();
  else if (activeTab.value === 'server-ini') fetchServerIni();
  else if (activeTab.value === 'server-cycle') fetchServerCycle();
  else if (activeTab.value === 'remote-admin') connectRemoteAdmin();
});

watch(activeTab, (newTab) => {
  if (newTab === 'remote-admin') {
    connectRemoteAdmin();
  } else if (remoteAdminWs) {
    remoteAdminWs.close();
    remoteAdminWs = null;
  }
});

onMounted(() => {
  sync();
  syncInterval = setInterval(sync, 1000);
});

onBeforeUnmount(() => {
  if (remoteAdminWs) {
    remoteAdminWs.close();
    remoteAdminWs = null;
  }
  clearInterval(syncInterval);
});
</script>

<template>
  <div class="admin-page">
    <!-- Header -->
    <header class="admin-header">
      <div class="admin-header-inner">
        <router-link to="/" class="admin-logo">WICGATE</router-link>
        <div class="admin-user">
          <span class="admin-username">{{ currentUser?.username }}</span>
          <button class="admin-logout" @click="handleLogout">
            <i class="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="admin-main">
      <button class="admin-refresh-btn" @click="refreshServers">
        <i class="fa-solid fa-rotate"></i> Refresh
      </button>

      <div class="admin-flex">
        <!-- Server List -->
        <table class="admin-servers">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="server in servers"
              :key="server.id"
              :class="{ active: activeServer?.id === server.id }"
              @click="activeServer = server"
            >
              <td class="server-name" v-html="colorize(server.name)"></td>
              <td class="server-status">
                {{ server.status }}
                <span v-if="server.status === 'queued'">{{ (server.queue ?? 0) + 1 }}</span>
              </td>
              <td class="server-actions">
                <span v-if="server.status === 'running'" @click.stop="stopServer(server.id)">
                  <i class="fas fa-ban" title="stop"></i>
                </span>
                <span v-if="server.status === 'running'" @click.stop="restartServer(server.id)">
                  <i class="fas fa-rotate" title="restart"></i>
                </span>
                <span v-if="server.status === 'stopped'" @click.stop="startServer(server.id)">
                  <i class="fas fa-play" title="start"></i>
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Text Panel -->
        <div class="admin-text">
          <!-- Tabs -->
          <ul class="admin-tabs">
            <li>
              <button
                :class="{ active: activeTab === 'main-log' }"
                @click="
                  activeTab = 'main-log';
                  fetchMainLog();
                "
              >
                Main Log
              </button>
            </li>
            <li>
              <button
                :class="{ active: activeTab === 'server-log' }"
                @click="
                  activeTab = 'server-log';
                  fetchServerLog();
                "
              >
                Server Log
              </button>
            </li>
            <li>
              <button
                :class="{ active: activeTab === 'server-ini' }"
                @click="
                  activeTab = 'server-ini';
                  fetchServerIni();
                "
              >
                Server Ini
              </button>
            </li>
            <li>
              <button
                :class="{ active: activeTab === 'server-cycle' }"
                @click="
                  activeTab = 'server-cycle';
                  fetchServerCycle();
                "
              >
                Server Cycle
              </button>
            </li>
            <li>
              <button
                :class="{ active: activeTab === 'remote-admin' }"
                @click="activeTab = 'remote-admin'"
              >
                Remote Admin
              </button>
            </li>
          </ul>

          <div class="admin-message">{{ message }}</div>

          <div class="admin-tab-content">
            <!-- Main Log -->
            <div v-if="activeTab === 'main-log'" class="tab-pane">
              <div v-for="(line, index) in formattedLog" :key="'log-' + index" class="log-line">
                <span :class="`log-${line.level}`">{{ line.content }}</span>
              </div>
            </div>

            <!-- Server Log -->
            <div v-if="activeTab === 'server-log'" class="tab-pane">
              <div v-if="activeServer">
                <div
                  v-for="(line, index) in serverLog"
                  :key="activeServer.id + '-log-' + index"
                  class="log-line"
                >
                  {{ line }}
                </div>
              </div>
              <div v-else class="select-server">Select a server.</div>
            </div>

            <!-- Server Ini -->
            <div v-if="activeTab === 'server-ini'" class="tab-pane">
              <div v-if="activeServer">
                <button class="admin-save-btn" @click="saveIni">Save</button>
                <textarea v-model="serverIni" rows="20" class="admin-textarea"></textarea>
              </div>
              <div v-else class="select-server">Select a server.</div>
            </div>

            <!-- Server Cycle -->
            <div v-if="activeTab === 'server-cycle'" class="tab-pane">
              <div v-if="activeServer">
                <button class="admin-save-btn" @click="saveCycle">Save</button>
                <textarea v-model="serverCycle" rows="20" class="admin-textarea"></textarea>
              </div>
              <div v-else class="select-server">Select a server.</div>
            </div>

            <!-- Remote Admin -->
            <div v-if="activeTab === 'remote-admin'" class="tab-pane">
              <div v-if="activeServer">
                <h4 class="remote-admin-title">
                  Remote Admin
                  <i class="fa fa-rotate" @click="remoteAdminRefresh"></i>
                </h4>
                <table class="players-table">
                  <thead>
                    <tr>
                      <th>Slot</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Score</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="player in players" :key="player.slot">
                      <td>{{ player.slot }}</td>
                      <td>{{ player.name }}</td>
                      <td>{{ player.role }}</td>
                      <td>{{ player.score }}</td>
                      <td>
                        <i class="fas fa-ban kick-btn" title="kick" @click="kick(player.slot)"></i>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="remote-output">
                  <pre v-for="(line, index) in remoteAdminOutput" :key="'remote-' + index">{{
                    line
                  }}</pre>
                </div>
              </div>
              <div v-else class="select-server">Select a server.</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: #0a0a0a;
  color: #fff;
}

.admin-header {
  background: linear-gradient(135deg, #1a1a1a, #0d0d0d);
  border-bottom: 2px solid #c41e3a;
  padding: 1rem 0;
}

.admin-header-inner {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.admin-logo {
  font-family: 'Oswald', sans-serif;
  font-size: 1.5rem;
  font-weight: bold;
  color: #c41e3a;
  text-decoration: none;
  letter-spacing: 2px;
}

.admin-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.admin-username {
  color: #fbbf24;
  font-weight: 600;
}

.admin-logout {
  background: linear-gradient(135deg, #c41e3a, #8b1528);
  color: #fff;
  border: 1px solid #e53e3e;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s;
}

.admin-logout:hover {
  background: linear-gradient(135deg, #e53e3e, #c41e3a);
  transform: translateY(-1px);
}

.admin-main {
  max-width: 1600px;
  margin: 0 auto;
  padding: 1rem;
}

.admin-refresh-btn {
  background: #2d3748;
  color: #fff;
  border: 1px solid #4a5568;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s;
}

.admin-refresh-btn:hover {
  background: #4a5568;
}

.admin-flex {
  display: flex;
  gap: 1rem;
}

.admin-servers {
  width: 450px;
  flex-shrink: 0;
  background: #111;
  border-collapse: collapse;
}

.admin-servers th,
.admin-servers td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #333;
}

.admin-servers th {
  background: #1a1a1a;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 1px;
  color: #888;
}

.admin-servers tr {
  cursor: pointer;
  transition: background 0.2s;
}

.admin-servers tr:hover {
  background: #222;
}

.admin-servers tr.active {
  background: #2d3748;
}

.server-name {
  min-width: 250px;
}

.server-status {
  text-transform: uppercase;
  font-size: 0.75rem;
}

.server-actions {
  display: flex;
  gap: 1rem;
}

.server-actions i {
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.2s;
}

.server-actions i:hover {
  color: #fbbf24;
}

.admin-text {
  flex: 1;
  background: #111;
  min-height: 600px;
}

.admin-tabs {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  border-bottom: 1px solid #333;
}

.admin-tabs button {
  background: transparent;
  border: none;
  color: #888;
  padding: 0.75rem 1.25rem;
  cursor: pointer;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
}

.admin-tabs button:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}

.admin-tabs button.active {
  color: #fff;
  background: linear-gradient(180deg, rgba(196, 30, 58, 0.3) 0%, transparent 100%);
  border-bottom: 2px solid #c41e3a;
}

.admin-message {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  color: #888;
  border-bottom: 1px solid #222;
}

.admin-tab-content {
  padding: 1rem;
  max-height: 550px;
  overflow-y: auto;
}

.tab-pane {
  color: #ccc;
}

.log-line {
  font-family: monospace;
  font-size: 0.8rem;
  line-height: 1.4;
  padding: 0.125rem 0;
}

.log-ERROR {
  color: #f56565;
}

.log-LOG {
  color: #a0aec0;
}

.select-server {
  color: #666;
  font-style: italic;
}

.admin-save-btn {
  background: #2b6cb0;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.2s;
}

.admin-save-btn:hover {
  background: #3182ce;
}

.admin-textarea {
  width: 100%;
  background: #1a1a1a;
  color: #fff;
  border: 1px solid #333;
  padding: 0.75rem;
  font-family: monospace;
  font-size: 0.8rem;
  resize: vertical;
}

.remote-admin-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.remote-admin-title i {
  cursor: pointer;
  color: #888;
  transition: color 0.2s;
}

.remote-admin-title i:hover {
  color: #fff;
}

.players-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.players-table th,
.players-table td {
  padding: 0.5rem;
  text-align: left;
  border-bottom: 1px solid #333;
}

.players-table th {
  background: #1a1a1a;
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 1px;
  color: #888;
}

.kick-btn {
  cursor: pointer;
  color: #e53e3e;
  transition: color 0.2s;
}

.kick-btn:hover {
  color: #fc8181;
}

.remote-output {
  background: #000;
  padding: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
}

.remote-output pre {
  margin: 0;
  font-family: monospace;
  font-size: 0.8rem;
  color: #a0aec0;
}

@media (max-width: 1024px) {
  .admin-flex {
    flex-direction: column;
  }

  .admin-servers {
    width: 100%;
  }
}
</style>
