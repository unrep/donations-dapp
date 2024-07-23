<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 16 16"
  >
    <path
      :fill="color"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.5"
      d="m11.25 4.75l-6.5 6.5m0-6.5l6.5 6.5"
    />
  </svg>
</template>

<script setup lang="ts">
defineProps({
  size: { type: String, default: "1rem" },
  color: { type: String, default: "none" },
});
</script>
