<script setup lang="ts">
interface AppFormEmits {
  submit: [event: SubmitEvent];
}

const emit = defineEmits<AppFormEmits>();
</script>

<template>
  <form class="app-form" novalidate @submit.prevent="emit('submit', $event)">
    <slot></slot>
  </form>
</template>

<style scoped>
.app-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
</style>
