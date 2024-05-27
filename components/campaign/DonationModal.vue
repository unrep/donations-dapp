<template>
  <Transition>
    <div
      v-if="isOpen"
      class="z-50 fixed top-0 left-0 w-screen h-screen flex items-center justify-center"
    >
      <div
        class="z-10 absolute w-full h-full bg-black bg-opacity-20 backdrop-blur-sm"
        @click.stop="emit('update:isOpen', false)"
      />

      <div
        class="z-20 overflow-hidden p-7 w-full max-w-3xl absolute shadow-lg rounded-3xl bg-white grid grid-cols-2 items-center justify-center gap-10"
        style="grid-template-columns: 1fr 2fr"
      >
        <div class="self-start space-y-5">
          <h1 class="text-4xl font-bold text-indigo-800">
            Donate to this campaign
          </h1>

          <p class="text-base text-gray-500">
            Your donation will help this campaign reach its goal.
          </p>
        </div>

        <div
          class="self-start w-full grid grid-cols-3 gap-2 items-center justify-start"
        >
          <p class="text-lg col-span-3 mb-3">
            You can choose a preset amount or enter a custom amount.
          </p>
          <button
            v-for="(price, index) in presetPrices"
            :key="index"
            :class="['button-style', price.selected && 'active']"
            @click="
              () => {
                showEthInput = false;
                togglePresetPrice(index);
              }
            "
          >
            {{ price.priceValue }}$
          </button>
          <button
            :class="['col-span-3 button-style', showEthInput && 'active']"
            @click="
              () => {
                showEthInput = !showEthInput;
                togglePresetPrice(null);
              }
            "
          >
            Custom amount
          </button>

          <Transition name="slide">
            <div v-if="showEthInput" class="w-full col-span-3 mt-5">
              <CommonETHInput
                :model-value="inputValue"
                @update:model-value="
                  (newValue) => {
                    inputValue = newValue;
                  }
                "
              />
            </div>
          </Transition>
        </div>

        <button
          class="w-min bg-white border text-indigo-800 text-lg font-medium px-8 py-2 rounded-xl hover:scale-105 duration-200 shadow-md"
          @click="emit('update:isOpen', false)"
        >
          Cancel
        </button>

        <button
          class="disabled:bg-indigo-500 disabled:hover:scale-100 justify-self-end w-min bg-indigo-800 text-white text-lg font-medium px-8 py-2 rounded-xl hover:scale-105 duration-200 shadow-md"
          :disabled="!canDonate"
        >
          Donate
        </button>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
const { isOpen } = defineProps({
  isOpen: Boolean,
});

const inputValue = ref<number | null>(null);
const showEthInput = ref(false);

const emit = defineEmits<{
  (eventName: "update:isOpen", value: boolean): void;
}>();

const presetPrices = ref<{ priceValue: number; selected: boolean }[]>([
  { priceValue: 5, selected: false },
  { priceValue: 25, selected: false },
  { priceValue: 100, selected: false },
]);

function togglePresetPrice(index: number | null) {
  if (index === null) {
    presetPrices.value.forEach((p) => (p.selected = false));
  } else {
    const isSelected = presetPrices.value[index].selected;
    presetPrices.value.forEach((p) => (p.selected = false));
    presetPrices.value[index].selected = !isSelected;
  }
}

const canDonate = ref(false);

// Optional: Debugging
watch(
  [presetPrices, showEthInput, inputValue],
  () => {
    canDonate.value = showEthInput.value
      ? !!inputValue.value
      : presetPrices.value.some((p) => p.selected);
  },
  { deep: true },
);
</script>

<style lang="scss" scoped>
.button-style {
  @apply bg-white text-indigo-800 border text-lg font-medium px-5 py-2 rounded-xl hover:scale-105 duration-200 shadow-md;
  &.active {
    @apply bg-indigo-800 text-white;
  }
}

.slide-enter-active,
.slide-leave-active {
  transition:
    max-height 0.2s ease-in-out,
    opacity 0.2s ease-in-out;
  max-height: 0; /* Initial state */
  opacity: 0.5;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0; /* Start collapsed */
}

.slide-enter-to,
.slide-leave-from {
  max-height: 50px;
  opacity: 1;
}
</style>
