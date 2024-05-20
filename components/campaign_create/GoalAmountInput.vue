<template>
  <div
    class="flex items-center justify-stretch gap-4 w-full border border-gray-300 outline-indigo-500 rounded-lg shadow-sm px-4 py-2 overflow-hidden"
  >
    <div class="text-gray-500">ETH</div>

    <input
      v-model="goalAmount"
      type="number"
      inputmode="numeric"
      pattern="\d*"
      class="w-full font-thin text-lg outline-none pl-4 border-l"
      @input="handleInputChange"
    />
    <Transition name="fade-to-left">
      <div
        v-if="goalAmount"
        class="text-sm text-black text-opacity-50 font-medium pl-4 py-1 border-l h-full duration-100"
      >
        {{ goalAmountUSD }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useCampaignStore } from "~/stores/campaign.store";

const { goalAmount } = storeToRefs(useCampaignStore());
const minInputValue = 0;
const maxInputValue = 100000;

const goalAmountUSD = computed(() =>
  computeETHPrice(goalAmount.value?.toString() || "0"),
);

function handleInputChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = target.value === "" ? null : Number(target.value);

  if (!value) return;

  if (value < minInputValue) {
    target.value = minInputValue.toString();
  } else if (value > maxInputValue) {
    target.value = maxInputValue.toString();
  }

  goalAmount.value = Number(target.value);
}
</script>

<style scoped lang="scss">
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}

.fade-to-left {
  &-enter-active,
  &-leave-active {
    transition: transform opacity 0.3s;
  }

  &-enter-from,
  &-leave-to {
    transform: translate(100%);
    opacity: 0;
  }

  &-enter-to,
  &-leave-from {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
