<script setup lang="ts">
import axios, { AxiosError } from 'axios';
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
let remoteAdminConnecting = false; // Prevent race condition on rapid reconnect
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
    role: result[2]!,
    score: Number(result[3]),
    name: result[4]!,
  };
}

// API Functions
async function fetchMainLog() {
  if (!token.value) return;
  try {
    const response = await axios.get(SERVER_URL + '/log', {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    log.value = response.data.reverse();
  } catch (error) {
    const axiosError = error as AxiosError<{ error?: string }>;
    message.value =
      datePrefix() +
      (axiosError.response?.data?.error || axiosError.message || 'Failed to fetch main log');
  }
}

async function fetchServers() {
  if (!token.value) return;
  try {
    const response = await axios.get(SERVER_URL + '/servers', {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    servers.value = response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ error?: string }>;
    message.value =
      datePrefix() +
      (axiosError.response?.data?.error || axiosError.message || 'Failed to fetch servers');
  }
}

async function fetchServerLog() {
  if (!activeServer.value || !token.value) return;
  try {
    const response = await axios.get(SERVER_URL + '/server-log/' + activeServer.value.id, {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    serverLog.value = response.data.split('\n').reverse();
  } catch (error) {
    const axiosError = error as AxiosError<{ error?: string }>;
    message.value =
      datePrefix() +
      (axiosError.response?.data?.error || axiosError.message || 'Failed to fetch server log');
  }
}

async function fetchServerIni() {
  if (!activeServer.value || !token.value) return;
  try {
    const response = await axios.get(SERVER_URL + '/server-ini/' + activeServer.value.id, {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    serverIni.value = response.data.content;
  } catch (error) {
    const axiosError = error as AxiosError<{ error?: string }>;
    message.value =
      datePrefix() +
      (axiosError.response?.data?.error || axiosError.message || 'Failed to fetch server ini');
  }
}

async function fetchServerCycle() {
  if (!activeServer.value || !token.value) return;
  try {
    const response = await axios.get(SERVER_URL + '/server-cycle/' + activeServer.value.id, {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    serverCycle.value = response.data.content;
  } catch (error) {
    const axiosError = error as AxiosError<{ error?: string }>;
    message.value =
      datePrefix() +
      (axiosError.response?.data?.error || axiosError.message || 'Failed to fetch server cycle');
  }
}

async function saveIni() {
  if (!activeServer.value || !token.value) return;
  try {
    const response = await axios.post(
      SERVER_URL + '/server-ini/' + activeServer.value.id,
      { content: serverIni.value },
      { headers: { Authorization: `Bearer ${token.value}` } }
    );
    message.value = datePrefix() + response.data.message;
  } catch (error) {
    const axiosError = error as AxiosError<{ error?: string }>;
    message.value =
      datePrefix() +
      (axiosError.response?.data?.error || axiosError.message || 'Failed to save ini');
  }
}

async function saveCycle() {
  if (!activeServer.value || !token.value) return;
  try {
    const response = await axios.post(
      SERVER_URL + '/server-cycle/' + activeServer.value.id,
      { content: serverCycle.value },
      { headers: { Authorization: `Bearer ${token.value}` } }
    );
    message.value = datePrefix() + response.data.message;
  } catch (error) {
    const axiosError = error as AxiosError<{ error?: string }>;
    message.value =
      datePrefix() +
      (axiosError.response?.data?.error || axiosError.message || 'Failed to save cycle');
  }
}

async function restartServer(serverId: string) {
  if (!token.value) return;
  try {
    await axios.post(
      SERVER_URL + '/server-restart/' + serverId,
      {},
      {
        headers: { Authorization: `Bearer ${token.value}` },
      }
    );
    sync();
  } catch (error) {
    const axiosError = error as AxiosError<{ error?: string }>;
    message.value =
      datePrefix() +
      (axiosError.response?.data?.error || axiosError.message || 'Failed to restart server');
  }
}

async function stopServer(serverId: string) {
  if (!token.value) return;
  try {
    await axios.post(
      SERVER_URL + '/server-stop/' + serverId,
      {},
      {
        headers: { Authorization: `Bearer ${token.value}` },
      }
    );
    sync();
  } catch (error) {
    const axiosError = error as AxiosError<{ error?: string }>;
    message.value =
      datePrefix() +
      (axiosError.response?.data?.error || axiosError.message || 'Failed to stop server');
  }
}

async function startServer(serverId: string) {
  if (!token.value) return;
  try {
    await axios.post(
      SERVER_URL + '/server-start/' + serverId,
      {},
      {
        headers: { Authorization: `Bearer ${token.value}` },
      }
    );
    sync();
  } catch (error) {
    const axiosError = error as AxiosError<{ error?: string }>;
    message.value =
      datePrefix() +
      (axiosError.response?.data?.error || axiosError.message || 'Failed to start server');
  }
}

async function refreshServers() {
  if (!token.value) return;
  try {
    await axios.post(
      SERVER_URL + '/refresh',
      {},
      {
        headers: { Authorization: `Bearer ${token.value}` },
      }
    );
    sync();
  } catch (error) {
    const axiosError = error as AxiosError<{ error?: string }>;
    message.value =
      datePrefix() +
      (axiosError.response?.data?.error || axiosError.message || 'Failed to refresh servers');
  }
}

async function postRemoteAdminCommand(command: string) {
  if (!activeServer.value || !token.value) return;
  try {
    await axios.post(
      SERVER_URL + '/remote-admin',
      { serverId: activeServer.value.id, command },
      { headers: { Authorization: `Bearer ${token.value}` } }
    );
  } catch (error) {
    const axiosError = error as AxiosError<{ error?: string }>;
    message.value =
      datePrefix() +
      (axiosError.response?.data?.error || axiosError.message || 'Remote admin command failed');
  }
}

function connectRemoteAdmin() {
  // Prevent race condition on rapid reconnect
  if (remoteAdminConnecting) return;

  remoteAdminOutput.value = [];
  if (remoteAdminWs) {
    remoteAdminWs.close();
    remoteAdminWs = null;
  }
  if (!activeServer.value) return;

  remoteAdminConnecting = true;

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
    remoteAdminConnecting = false;
    console.log('Connected to remote admin WebSocket');
    try {
      await axios.post(
        SERVER_URL + '/remote-admin',
        { serverId: activeServer.value!.id, command: '/listplayerslots' },
        { headers: { Authorization: `Bearer ${token.value}` } }
      );
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: string }>;
      message.value =
        datePrefix() + (axiosError.response?.data?.error || axiosError.message || 'Error');
    }
  };
  remoteAdminWs.onmessage = (event) => {
    remoteAdminOutput.value.push(event.data);
    const player = parseRemoteAdminResponse(event.data);
    if (player) {
      players.value.push(player);
    }
  };
  remoteAdminWs.onerror = () => {
    remoteAdminConnecting = false;
    console.error('Remote admin WebSocket error');
    message.value = datePrefix() + 'WebSocket connection error';
  };
  remoteAdminWs.onclose = () => {
    remoteAdminConnecting = false;
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
  if (activeTab.value === 'main-log') await fetchMainLog();
  else if (activeTab.value === 'server-log') await fetchServerLog();
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
  syncInterval = setInterval(sync, 5000);
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
              <td class="admin-server-name" v-html="colorize(server.name)"></td>
              <td class="admin-server-status">
                {{ server.status }}
                <span v-if="server.status === 'queued'">{{ (server.queue ?? 0) + 1 }}</span>
              </td>
              <td class="admin-server-actions">
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
            <div v-if="activeTab === 'main-log'" class="admin-tab-pane">
              <div
                v-for="(line, index) in formattedLog"
                :key="'log-' + index"
                class="admin-log-line"
              >
                <span :class="`log-${line.level}`">{{ line.content }}</span>
              </div>
            </div>

            <!-- Server Log -->
            <div v-if="activeTab === 'server-log'" class="admin-tab-pane">
              <div v-if="activeServer">
                <div
                  v-for="(line, index) in serverLog"
                  :key="activeServer.id + '-log-' + index"
                  class="admin-log-line"
                >
                  {{ line }}
                </div>
              </div>
              <div v-else class="admin-select-server">Select a server.</div>
            </div>

            <!-- Server Ini -->
            <div v-if="activeTab === 'server-ini'" class="admin-tab-pane">
              <div v-if="activeServer">
                <button class="admin-save-btn" @click="saveIni">Save</button>
                <textarea v-model="serverIni" rows="20" class="admin-textarea"></textarea>
              </div>
              <div v-else class="admin-select-server">Select a server.</div>
            </div>

            <!-- Server Cycle -->
            <div v-if="activeTab === 'server-cycle'" class="admin-tab-pane">
              <div v-if="activeServer">
                <button class="admin-save-btn" @click="saveCycle">Save</button>
                <textarea v-model="serverCycle" rows="20" class="admin-textarea"></textarea>
              </div>
              <div v-else class="admin-select-server">Select a server.</div>
            </div>

            <!-- Remote Admin -->
            <div v-if="activeTab === 'remote-admin'" class="admin-tab-pane">
              <div v-if="activeServer">
                <h4 class="admin-remote-title">
                  Remote Admin
                  <i class="fa fa-rotate" @click="remoteAdminRefresh"></i>
                </h4>
                <table class="admin-players-table">
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
                        <i
                          class="fas fa-ban admin-kick-btn"
                          title="kick"
                          @click="kick(player.slot)"
                        ></i>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="admin-remote-output">
                  <pre v-for="(line, index) in remoteAdminOutput" :key="'remote-' + index">{{
                    line
                  }}</pre>
                </div>
              </div>
              <div v-else class="admin-select-server">Select a server.</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
