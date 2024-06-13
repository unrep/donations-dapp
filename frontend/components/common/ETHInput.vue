<template>
  <div
    :class="[
      'bg-white create-campaign-input  flex items-center justify-stretch gap-4 w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 overflow-hidden',
      { 'border-indigo-800 border-shadow': isFocused },
    ]"
  >
    <div class="text-gray-500">ETH</div>

    <input
      v-model="inputted"
      type="number"
      inputmode="numeric"
      pattern="\d*"
      class="w-full font-thin text-lg outline-none pl-4 border-l"
      @focus="isFocused = true"
      @blur="isFocused = false"
      @input="handleInputChange"
    />
    <Transition name="fade-to-left">
      <div
        v-if="inputted"
        class="text-sm text-black text-opacity-50 font-medium pl-4 py-1 border-l h-full duration-100"
      >
        {{ inputtedUSD }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computedAsync } from "@vueuse/core";

const props = defineProps({
  modelValue: {
    type: [Number, null] as any,
    required: true,
  },
});

const emit = defineEmits<{
  (eventName: "update:modelValue", value: number | null): void;
}>();

const inputted = computed({
  get: () => props.modelValue,
  set: (value: number | null) => {
    emit("update:modelValue", validateInputMinMax(value));
  },
});

const minInputValue = 0;
const maxInputValue = 100000;

const inputtedUSD = computedAsync(() =>
  computeETHPrice(inputted.value?.toString() || "0"),
);

const isFocused = ref(false);

function validateInputMinMax(value: number | null) {
  if (!value) return null;

  if (value < minInputValue) {
    value = minInputValue;
  } else if (value > maxInputValue) {
    value = maxInputValue;
  }

  return value;
}

function handleInputChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = target.value === "" ? null : Number(target.value);

  if (!value) return;

  if (value < minInputValue) {
    target.value = minInputValue.toString();
  } else if (value > maxInputValue) {
    target.value = maxInputValue.toString();
  }
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

.border-shadow {
  box-shadow: 0 0 0px 1px #3730a3;
}
</style>
