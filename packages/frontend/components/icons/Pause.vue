<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
  >
    <path :fill="color" d="M18 18H6V6h12z" />
  </svg>
</template>

<script setup lang="ts">
defineProps({
  size: { type: String, default: "1.5rem" },
  color: { type: String, default: "rgb(79 70 229)" },
});
</script>
