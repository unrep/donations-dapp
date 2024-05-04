<template>
  <button class="poll-btn">{{ text }}</button>
</template>

<script setup lang="ts">
defineProps<{
  text: string;
}>();
</script>

<style lang="scss" scoped>
.poll-btn {
  @apply bg-indigo-500 text-white px-5 py-2 rounded-full duration-200;
  &:hover {
    @apply bg-indigo-600 scale-105;
  }
}
</style>
