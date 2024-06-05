<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="`${size}em`"
    :height="`${size}em`"
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
  size: { type: Number, default: 1 },
  color: { type: String, default: "none" },
});
</script>
