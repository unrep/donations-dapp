<template>
  <!-- Desktop -->
  <div class="hidden mlg:flex h-full w-full flex-col justify-between p-10">
    <div class="text-4xl font-black text-white text-left w-full">
      <NuxtLink
        to="/"
        class="mb-5 w-full flex items-center justify-center gap-2 text-lg text-white hover:scale-105 duration-200"
      >
        <IconsArrow class="-rotate-90" />
        <span class="font-normal">Home</span>
      </NuxtLink>

      Create a Campaign
    </div>

    <div class="flex flex-col items-center justify-center gap-10">
      <div class="w-full flex flex-col items-center justify-center gap-2">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="w-full duration-200 animate-appear-bounce z-10"
          :style="{
            '--delay': `${index * 200}ms`,
          }"
        >
          <div
            :class="[
              'w-full flex items-center gap-2 p-2 rounded-full duration-200',
              step.selected
                ? 'scale-110 translate-x-[4.25%] opacity-100'
                : 'scale-100 translate-x-0 opacity-30',
            ]"
          >
            <div
              class="self-start bg-white aspect-square text-indigo-600 size-8 rounded-full flex justify-center items-center"
            >
              <div v-if="currentStep.index <= index">
                {{ index + 1 }}
              </div>
              <div v-else><IconsCheck /></div>
            </div>

            <div :class="`text-white line-clamp-1`">
              {{ step.stepName }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div />
  </div>

  <!-- Mobile -->
  <div
    class="mlg:hidden flex flex-col items-center justify-center w-full py-10 bg-indigo-500 font-black text-white duration-200"
  >
    <NuxtLink
      to="/"
      class="mb-10 w-full flex items-center justify-center gap-2 text-lg text-white hover:scale-105 duration-200"
    >
      <IconsArrow class="-rotate-90" />
      <span class="font-medium">Home</span>
    </NuxtLink>

    <div class="w-full h-full flex items-center justify-center">
      <TransitionRoot
        v-for="(step, index) in steps"
        :key="index"
        :show="index >= indexesToDisplay[0] && index <= indexesToDisplay[1]"
        :class="[
          'flex-grow w-full flex items-center justify-center overflow-hidden duration-500',
        ]"
        enter="transition-all"
        enter-from="max-w-0 scale-0 opacity-0"
        :enter-to="`window-max-width scale-100 opacity-100`"
        leave="transition-all"
        :leave-from="`window-max-width scale-100 opacity-100`"
        leave-to="max-w-0 scale-0 opacity-0"
        :style="{
          '--max-width': `${viewportWidth / 3}px`,
        }"
      >
        <div
          :class="[
            'w-full flex-grow flex flex-col gap-2 items-center font-bold justify-center duration-200',
            step.selected ? 'opacity-100' : 'opacity-50 scale-75',
          ]"
        >
          <div
            class="size-10 bg-white rounded-full flex justify-center items-center text-indigo-500"
          >
            {{ index + 1 }}
          </div>
          <div class="text-white text-center line-clamp-2 w-min">
            {{ step.shortStepName }}
          </div>
        </div>
      </TransitionRoot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TransitionRoot } from "@headlessui/vue";

import { useCampaignStore } from "~/stores/campaign.store";

const { currentStep, steps } = storeToRefs(useCampaignStore());

const viewportWidth = ref(window.innerWidth);

const indexesToDisplay = computed(() => {
  const index = currentStep.value.index;
  if (index === 0) {
    return [index, index + 2];
  } else if (index === steps.value.length - 1) {
    return [index - 2, index];
  } else {
    return [index - 1, index + 1];
  }
});
</script>

<style lang="scss" scoped>
.window-max-width {
  max-width: var(--max-width);
}

.animate-appear-bounce {
  transform: scale(0);
  animation: appearWithBounce 0.5s ease-out var(--delay) forwards;
}

@keyframes appearWithBounce {
  0% {
    transform: scale(50%) translateX(-25%);
  }
  70% {
    transform: scale(110%) translateX(4.25%);
  }
  100% {
    transform: scale(100%) translateX(0);
  }
}
</style>
