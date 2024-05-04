<template>
  <div class="polls-grid">
    <div
      v-for="(poll, index) in polls"
      :key="poll.id"
      :class="[index % cellPattern === 0 && `lg:row-span-2 lg:col-span-2`]"
    >
      {{ poll.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
const { polls } = defineProps({
  polls: { type: Array<{ id: string; text: string }>, required: true },
});

const cellPattern = ref(0);

onMounted(subscribeCellPattern);

function subscribeCellPattern() {
  const windowBreakpoint = 1536;
  const updateCellPattern = () => {
    if (window.innerWidth >= windowBreakpoint) {
      cellPattern.value = 3;
    } else {
      cellPattern.value = 4;
    }
  };
  updateCellPattern();
  window.addEventListener("resize", updateCellPattern);
}
</script>

<style lang="scss" scoped>
.polls-grid {
  @apply md:grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 items-center gap-4 w-2/3 m-auto;

  div {
    @apply border bg-white shadow-md rounded-lg p-5 w-full text-xl aspect-square;
  }
}
</style>
