<template>
  <div
    class="relative flex-grow w-full h-full flex flex-col items-center justify-between input-container bg-white slide-in p-10 sm:py-20 mlg:py-10"
  >
    <Transition class="hidden mlg:flex" name="scale">
      <button
        v-if="currentStep.index > 0"
        :class="[
          'text-gray-500 mlg:hover:text-gray-600 active:text-gray-600 mlg:hover:border-gray-400 active:border-gray-400 absolute overflow-hidden px-5 py-3 bg-white border rounded-full mlg:hover:scale-105 active:scale-105 duration-200 flex justify-center items-center gap-2',
          currentStep.index > 0 ? 'scale-100' : 'scale-x-50 scale-y-0',
        ]"
        style="box-shadow: 0 0 10px -2px rgba(0, 0, 0, 0.1)"
        @click="onBack()"
      >
        <IconsArrow class="-rotate-90" />
        Previous step
      </button>
    </Transition>
    <div class="hidden mlg:block" />

    <div class="w-full flex flex-col items-center justify-between gap-5">
      <div class="text-3xl font-black text-black text-center">
        {{ mainText }}
      </div>
      <div class="w-full max-w-lg">
        <slot name="input" />

        <div class="text-sm text-black text-opacity-50 px-2 pt-3 text-justify">
          {{ descriptionText }}
        </div>
      </div>
    </div>

    <!-- Mobile -->
    <div
      class="z-50 flex gap-5 margin-auto justify-self-end fixed mlg:relative bottom-10 mlg:bottom-0"
    >
      <Transition class="flex mlg:hidden" name="scale">
        <button
          v-if="currentStep.index > 0"
          ontouchstart=""
          :class="[
            'px-10 py-3 bg-white border rounded-xl text-gray-500 active:scale-105 duration-200',
            currentStep.index > 0 ? 'scale-100' : 'scale-x-50 scale-y-0',
          ]"
          style="box-shadow: 0 0 10px -2px rgba(0, 0, 0, 0.1)"
          @click="onBack()"
        >
          Back
        </button>
      </Transition>
      <button
        ontouchstart=""
        tabindex="0"
        class="py-3 px-10 shadow-xl bg-indigo-500 font-medium text-mlg rounded-xl text-white mlg:hover:scale-105 active:scale-105 duration-200"
        @click="onContinue()"
      >
        Continue
      </button>
    </div>
    <!-- <div class="mlg:hidden" /> -->
  </div>
</template>

<script lang="ts" setup>
import { useCampaignStore } from "~/stores/campaign.store";

const { currentStep } = storeToRefs(useCampaignStore());

defineProps<{
  mainText: string;
  onContinue: Function;
  onBack: Function;
  descriptionText: string;
}>();
</script>

<style lang="scss">
.scale-enter-active,
.scale-leave-active {
  transition: scale 0.2s ease-in-out;
}

.scale-enter-from,
.scale-leave-to {
  scale: 0;
}

@media (min-width: 896px) {
  .slide-in {
    animation: slideInFromRightWithBounce 0.5s ease-out;
  }

  .input-container {
    box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.5);
  }
}

@keyframes slideInFromRightWithBounce {
  0% {
    transform: translateX(100%);
    width: 200%;
  }
  70% {
    transform: translateX(-5%);
  }
  100% {
    width: 100%;
    transform: translateX(0);
  }
}
</style>
