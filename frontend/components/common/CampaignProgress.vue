<template>
  <div class="text-lg mt-5 px-1">
    {{ raisedUSD }}
    <span class="font-semibold text-base">raised of {{ goalUSD }} </span>
  </div>

  <div class="w-full px-1 text-center mt-2">
    <div class="w-full text-sm text-gray-500 flex justify-between items-center">
      <span>Progress</span>
      <span class="text-base">{{ raisedPercentage }}%</span>
    </div>
    <div class="w-full rounded-full overflow-hidden h-3 bg-gray-200">
      <div
        class="raised-percentage-width h-full bg-indigo-800 rounded-full"
        :style="{ '--raised-percentage': `${raisedPercentage}%` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Campaign } from "~/types";

const { campaign } = defineProps<{
  campaign: Campaign;
}>();

const goalUSD = computed(() => computeETHPrice(campaign.goal));
const raisedUSD = computed(() => computeETHPrice(campaign.raised));

const raisedPercentage = computed(() =>
  Math.floor((Number(campaign.raised) / Number(campaign.goal)) * 100),
);
</script>

<style scoped lang="scss">
.raised-percentage-width {
  width: var(--raised-percentage);
}
</style>
