<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import AppHeader from './components/AppHeader.vue';

const route = useRoute();
const shouldShowHeader = computed<boolean>(() => route.name !== 'login');
</script>

<template>
  <AppHeader v-if="shouldShowHeader" />
  <RouterView />
</template>
