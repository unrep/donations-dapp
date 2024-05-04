<template>
  <div
    class="bg-white shrink-0 snap-center w-full max-w-xs relative group flex flex-col items-center justify-center from-gray-100 bg-gradient-to-br shadow-lg rounded-3xl overflow-hidden hover:border-indigo-500 hover:border-2 duration-300"
  >
    <img
      class="z-10 w-full h-full aspect-video object-cover object-center relative group-hover:scale-[2.5] group-hover:translate-y-1/2 duration-500 ease-in-out"
      :src="image"
      alt="campaign"
    />

    <div
      class="z-0 overflow-hidden w-full group-hover:opacity-0 delay-200 group-hover:delay-0 flex flex-col items-start justify-center p-5 duration-500"
    >
      <div class="text-xl font-bold">{{ title }}</div>

      <div class="text-base mt-5 px-1">
        {{ raised }} ETH
        <span class="font-semibold text-sm">of {{ goal }} ETH</span>
      </div>

      <div class="w-full px-1 text-center mt-2">
        <div
          class="w-full text-sm text-gray-500 flex justify-between items-center"
        >
          <span>Progress</span>
          <span class="text-base">{{ raisedPercentage }}%</span>
        </div>
        <div class="w-full rounded-full overflow-hidden h-3 bg-gray-200">
          <div
            class="raised-percentage-width h-full bg-indigo-500 rounded-full"
            :style="{ '--raised-percentage': `${raisedPercentage}%` }"
          />
        </div>
      </div>
    </div>

    <div
      class="z-20 overflow-hidden p-5 absolute bg-opacity-50 backdrop-blur-md flex gap-5 flex-col items-center justify-between -top-full group-hover:-top-0 left-0 w-full h-full bg-white duration-500 ease-in-out"
    >
      <div class="text-xl font-bold">{{ title }}</div>

      <div class="overflow-hidden line-clamp-[7]">
        {{ description }}
      </div>

      <div
        class="w-full translate-y-[200%] group-hover:translate-y-0 delay-[400ms] duration-200"
      >
        <button
          class="shadow-lg font-semibold w-full px-5 py-2 bg-indigo-500 text-white rounded-xl hover:scale-105 duration-200"
          @click="console.log('Donate button clicked!')"
        >
          See campaign page
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { title, goal, raised, image } = defineProps<{
  title: string;
  description: string;
  goal: number;
  raised: number;
  image: string;
}>();

const raisedPercentage = computed(() => Math.floor((raised / goal) * 100));
</script>

<style scoped lang="scss">
.raised-percentage-width {
  width: var(--raised-percentage);
}
</style>
