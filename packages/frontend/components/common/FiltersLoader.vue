<template>
  <div class="w-full flex items-center justify-center flex-wrap gap-2">
    <div
      v-for="(_, index) in Array(20)"
      :key="index"
      class="filter-loading-item rounded-full h-10 bg-gray-100 animate-pulse"
    />
  </div>
</template>

<script lang="ts" setup>
function randomizeWidths() {
  const items = document.getElementsByClassName("filter-loading-item");
  for (let i = 0; i < items.length; i++) {
    const element = items[i] as HTMLElement;
    element.style.width = `${Math.random() * 3 + 4}rem`; // Random width between 4rem and 7rem
  }
}

onMounted(randomizeWidths);
</script>
