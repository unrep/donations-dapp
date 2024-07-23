<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 256 256"
  >
    <path
      fill="currentColor"
      d="M205.66 117.66a8 8 0 0 1-11.32 0L136 59.31V216a8 8 0 0 1-16 0V59.31l-58.34 58.35a8 8 0 0 1-11.32-11.32l72-72a8 8 0 0 1 11.32 0l72 72a8 8 0 0 1 0 11.32"
    />
  </svg>
</template>

<script setup lang="ts">
defineProps({
  size: { type: String, default: "1.5rem" },
  color: { type: String, default: "rgb(79 70 229)" },
});
</script>
