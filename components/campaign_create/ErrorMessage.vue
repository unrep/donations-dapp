<template>
  <div
    :class="[
      'px-2 text-red-500 animate-pulse duration-200 leading-5 overflow-hidden ease-out',
      errorMessage ? 'max-h-6 pt-1' : 'max-h-0 pt-0',
    ]"
  >
    {{ errorMessage }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  errorMessage?: string;
}>();
</script>
