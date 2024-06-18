<template>
  <!-- Desktop -->
  <div
    class="sticky top-0 left-0 hidden mlg:grid grid-rows-3 h-full max-h-screen w-full justify-between p-10"
  >
    <CommonBlobs />

    <div class="text-4xl font-black text-indigo-800 text-left w-full">
      <NuxtLink
        to="/"
        class="mb-5 w-full flex items-center justify-center gap-2 text-lg text-indigo-800 hover:scale-105 duration-200"
      >
        <IconsArrow class="-rotate-90" />
        <span class="font-medium">Home</span>
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
              step.completed ? 'opacity-30' : 'opacity-100',
            ]"
          >
            <div
              class="self-start bg-indigo-800 aspect-square text-white size-8 rounded-full flex justify-center items-center"
            >
              <div v-if="step.completed">
                <IconsCheck color="white" />
              </div>
              <div v-else>
                {{ index + 1 }}
              </div>
            </div>

            <div :class="`text-indigo-800 font-medium line-clamp-1`">
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
    class="mlg:hidden flex flex-col items-center justify-center gap-5 bg-indigo-800 w-full py-5 font-black text-white duration-200"
  >
    <div
      class="w-full flex flex-col justify-center items-center px-10 pb-3 pt-1 gap-5"
    >
      <NuxtLink
        to="/"
        class="w-full left-10 flex items-center justify-center gap-2 text-base text-white hover:scale-105 duration-200"
      >
        <IconsArrow class="-rotate-90 size-4" />
        <span class="font-medium">Home</span>
      </NuxtLink>
      <div class="text-3xl">Create a Campaign</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCampaignStore } from "~/stores/campaign";

const { steps } = useCampaignStore();
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
