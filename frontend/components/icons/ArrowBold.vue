<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
  >
    <path
      fill="none"
      :stroke="color"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M12 5v14m6-8l-6-6m-6 6l6-6"
    />
  </svg>
</template>

<script setup lang="ts">
defineProps({
  size: { type: String, default: "1.5rem" },
  color: { type: String, default: "rgb(79 70 229)" },
});
</script>
