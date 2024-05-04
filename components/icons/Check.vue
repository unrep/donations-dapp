<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="`${size}em`"
    :height="`${size}em`"
    viewBox="0 0 24 24"
  >
    <path
      :fill="color"
      d="M9.84 17.08a.997.997 0 0 1-.707-.293l-3.84-3.84a1 1 0 1 1 1.414-1.414l3.133 3.133l7.453-7.453a1 1 0 0 1 1.414 1.414l-8.16 8.16a.997.997 0 0 1-.707.293"
    />
  </svg>
</template>

<script setup lang="ts">
defineProps({
  size: { type: Number, default: 1.5 },
  color: { type: String, default: "rgb(79 70 229)" },
});
</script>
