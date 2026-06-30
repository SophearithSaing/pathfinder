<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import AppHeader from './components/AppHeader.vue';
import AppLoadingScreen from './components/AppLoadingScreen.vue';
import { useAuthStore } from './stores/auth';

const route = useRoute();
const authStore = useAuthStore();
const shouldShowHeader = computed<boolean>(() =>
  authStore.hasBootstrapped && route.name !== 'login',
);
</script>

<template>
  <AppLoadingScreen v-if="!authStore.hasBootstrapped" />
  <template v-else>
    <AppHeader v-if="shouldShowHeader" />
    <RouterView />
  </template>
</template>
