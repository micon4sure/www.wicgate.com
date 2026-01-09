<script setup lang="ts">
/* global File, FileReader, Blob */
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore, USER_API_URL } from '../stores/auth';
import axios from 'axios';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const router = useRouter();
const authStore = useAuthStore();

interface Profile {
  profileId: number;
  profileName: string;
  clanId: number | null;
  rankInClan: number;
  isOnline: boolean;
  lastLogin: string | null;
}

interface AccountData {
  account: {
    id: number;
    email: string;
    createdAt: string;
  };
  profiles: Profile[];
}

const accountData = ref<AccountData | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const uploadingProfileId = ref<number | null>(null);
const uploadError = ref<string | null>(null);
const uploadSuccess = ref<string | null>(null);

// Cropper state
const showCropModal = ref(false);
const cropImageSrc = ref<string | null>(null);
const cropProfileId = ref<number | null>(null);
const cropperRef = ref<InstanceType<typeof Cropper> | null>(null);
const originalFile = ref<File | null>(null);

async function fetchAccountData() {
  loading.value = true;
  error.value = null;

  try {
    const response = await axios.get(USER_API_URL + '/api/user/account', {
      headers: { Authorization: `Bearer ${authStore.authToken}` },
    });
    accountData.value = response.data;
  } catch (e: unknown) {
    const axiosError = e as { response?: { data?: { error?: string } }; message?: string };
    error.value =
      axiosError.response?.data?.error || axiosError.message || 'Failed to load account';
  } finally {
    loading.value = false;
  }
}

function handleLogout() {
  authStore.logout();
  router.push('/');
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function openCropModal(profileId: number, event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0]!;
  originalFile.value = file;
  cropProfileId.value = profileId;

  const reader = new FileReader();
  reader.onload = (e) => {
    cropImageSrc.value = e.target?.result as string;
    showCropModal.value = true;
  };
  reader.readAsDataURL(file);
  input.value = '';
}

function closeCropModal() {
  showCropModal.value = false;
  cropImageSrc.value = null;
  cropProfileId.value = null;
  originalFile.value = null;
}

async function confirmCrop() {
  if (!cropperRef.value || !cropProfileId.value || !originalFile.value) return;

  const { canvas } = cropperRef.value.getResult();
  if (!canvas) return;

  uploadingProfileId.value = cropProfileId.value;
  uploadError.value = null;
  uploadSuccess.value = null;

  // Convert canvas to blob
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b: Blob | null) => resolve(b!), 'image/png');
  });

  const formData = new FormData();
  formData.append('picture', blob, 'cropped.png');

  try {
    await axios.post(`${USER_API_URL}/api/user/profile/${cropProfileId.value}/picture`, formData, {
      headers: {
        Authorization: `Bearer ${authStore.authToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    uploadSuccess.value = `Profile picture updated for profile ${cropProfileId.value}`;
    closeCropModal();
  } catch (e: unknown) {
    const axiosError = e as { response?: { data?: { error?: string } }; message?: string };
    uploadError.value =
      axiosError.response?.data?.error || axiosError.message || 'Failed to upload';
  } finally {
    uploadingProfileId.value = null;
  }
}

onMounted(() => {
  fetchAccountData();
});
</script>

<template>
  <div class="min-h-screen p-5">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8 pt-8">
        <div>
          <h1
            class="font-military text-3xl font-bold text-massgate-red-bright uppercase tracking-[2px]"
            style="
              text-shadow:
                0 0 20px rgba(229, 53, 53, 0.5),
                0 0 40px rgba(198, 40, 40, 0.3);
            "
          >
            Account Panel
          </h1>
          <p class="font-body text-sm text-battlefield-mist mt-1">{{ authStore.userName }}</p>
        </div>
        <div class="flex gap-4">
          <router-link
            to="/"
            class="text-sm text-teal hover:text-teal-bright transition-colors duration-300 font-body uppercase tracking-wide"
          >
            <i class="fa-solid fa-home mr-2"></i>
            Home
          </router-link>
          <button
            class="text-sm text-massgate-red-bright hover:text-massgate-red transition-colors duration-300 font-body uppercase tracking-wide"
            @click="handleLogout"
          >
            <i class="fa-solid fa-sign-out-alt mr-2"></i>
            Logout
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <i class="fa-solid fa-spinner fa-spin text-4xl text-teal"></i>
        <p class="font-body text-battlefield-mist mt-4">Loading account data...</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="p-6 bg-massgate-red-dark/30 border border-massgate-red-bright/50 text-massgate-red-bright font-body"
      >
        <i class="fa-solid fa-exclamation-triangle mr-2"></i>
        {{ error }}
      </div>

      <!-- Account Data -->
      <div v-else-if="accountData" class="space-y-6">
        <!-- Account Info Card -->
        <div
          class="bg-gradient-to-br from-texture-panel/95 to-texture-dark/95 border-2 border-massgate-red/50 p-6"
        >
          <h2 class="font-military text-xl text-teal uppercase tracking-wide mb-4">
            <i class="fa-solid fa-user mr-2"></i>
            Account Information
          </h2>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 font-body">
            <div>
              <span class="text-battlefield-mist/60 text-sm uppercase">Account ID</span>
              <p class="text-t font-mono">{{ accountData.account.id }}</p>
            </div>
            <div>
              <span class="text-battlefield-mist/60 text-sm uppercase">Email</span>
              <p class="text-t">{{ accountData.account.email }}</p>
            </div>
            <div>
              <span class="text-battlefield-mist/60 text-sm uppercase">Created</span>
              <p class="text-t">{{ formatDate(accountData.account.createdAt) }}</p>
            </div>
            <div>
              <span class="text-battlefield-mist/60 text-sm uppercase">Profiles</span>
              <p class="text-t">{{ accountData.profiles.length }}</p>
            </div>
          </div>
        </div>

        <!-- Profiles Card -->
        <div
          class="bg-gradient-to-br from-texture-panel/95 to-texture-dark/95 border-2 border-massgate-red/50 p-6"
        >
          <h2 class="font-military text-xl text-teal uppercase tracking-wide mb-4">
            <i class="fa-solid fa-users mr-2"></i>
            Profiles
          </h2>

          <div v-if="accountData.profiles.length === 0" class="text-battlefield-mist/60 font-body">
            No profiles found on this account.
          </div>

          <div v-else class="space-y-4">
            <!-- Upload status messages -->
            <div
              v-if="uploadError"
              class="p-3 bg-massgate-red-dark/30 border border-massgate-red-bright/50 text-massgate-red-bright font-body text-sm"
            >
              <i class="fa-solid fa-exclamation-triangle mr-2"></i>{{ uploadError }}
            </div>
            <div
              v-if="uploadSuccess"
              class="p-3 bg-green-900/30 border border-green-500/50 text-green-400 font-body text-sm"
            >
              <i class="fa-solid fa-check mr-2"></i>{{ uploadSuccess }}
            </div>

            <div
              v-for="profile in accountData.profiles"
              :key="profile.profileId"
              class="bg-texture-dark/50 border border-massgate-red/30 p-4 flex justify-between items-center"
            >
              <div class="flex items-center gap-4">
                <img
                  :src="`https://www.wicgate.com/pcc/${profile.profileId}.webp?t=${Date.now()}`"
                  :alt="profile.profileName"
                  class="w-12 h-12 object-cover bg-texture-dark border border-massgate-red/30"
                  @error="($event.target as HTMLImageElement).style.display = 'none'"
                />
                <div>
                  <p class="text-t font-body text-lg">
                    <i
                      class="fa-solid fa-circle mr-2"
                      :class="profile.isOnline ? 'text-green-500' : 'text-gray-500'"
                    ></i>
                    {{ profile.profileName }}
                  </p>
                  <p class="text-battlefield-mist/60 text-sm font-body">
                    Last login: {{ formatDate(profile.lastLogin) }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <label
                  class="cursor-pointer text-teal hover:text-teal-bright transition-colors text-sm font-body uppercase"
                >
                  <i
                    v-if="uploadingProfileId === profile.profileId"
                    class="fa-solid fa-spinner fa-spin mr-1"
                  ></i>
                  <i v-else class="fa-solid fa-camera mr-1"></i>
                  {{ uploadingProfileId === profile.profileId ? 'Uploading...' : 'Upload Picture' }}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/gif,image/bmp,image/webp"
                    class="hidden"
                    :disabled="uploadingProfileId !== null"
                    @change="openCropModal(profile.profileId, $event)"
                  />
                </label>
                <div class="text-right">
                  <p class="text-battlefield-mist/60 text-sm font-body">Profile ID</p>
                  <p class="text-t font-mono">{{ profile.profileId }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Crop Modal -->
    <div
      v-if="showCropModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
    >
      <div class="bg-texture-panel border-2 border-massgate-red/50 p-6 max-w-2xl w-full mx-4">
        <h3 class="font-military text-xl text-teal uppercase tracking-wide mb-4">
          <i class="fa-solid fa-crop mr-2"></i>
          Adjust Profile Picture
        </h3>

        <div class="mb-4 bg-texture-dark flex items-center justify-center max-h-[400px]">
          <Cropper
            ref="cropperRef"
            :src="cropImageSrc"
            :stencil-props="{
              aspectRatio: 1,
            }"
            :resize-image="{
              adjustStencil: false,
            }"
            image-restriction="stencil"
            :min-width="64"
            :min-height="64"
            class="cropper-fit max-h-[400px] max-w-full"
          />
        </div>

        <p class="text-battlefield-mist/60 text-sm font-body mb-4">
          Drag to position, scroll to zoom. The image will be cropped to a square.
        </p>

        <div class="flex justify-end gap-4">
          <button
            class="px-4 py-2 bg-texture-dark border border-battlefield-mist/30 text-battlefield-mist hover:bg-texture-panel transition-colors font-body uppercase text-sm"
            @click="closeCropModal"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 bg-teal/20 border border-teal text-teal hover:bg-teal/30 transition-colors font-body uppercase text-sm"
            :disabled="uploadingProfileId !== null"
            @click="confirmCrop"
          >
            <i v-if="uploadingProfileId !== null" class="fa-solid fa-spinner fa-spin mr-2"></i>
            {{ uploadingProfileId !== null ? 'Uploading...' : 'Apply' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
