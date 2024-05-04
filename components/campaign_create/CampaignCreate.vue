<template>
  <div
    class="w-full h-full min-h-screen flex flex-col mlg:grid grid-cols-2 items-stretch justify-center from-indigo-600 mlg:to-white mlg:bg-gradient-to-r"
    style="grid-template-columns: max-content 1fr"
  >
    <CampaignCreateSteps />

    <CampaignCreateStepWrapper
      :main-text="currentStep.step?.mainText || ''"
      :description-text="currentStep.step?.descriptionText || ''"
      :on-continue="onContinue"
      :on-back="onBack"
    >
      <template #input>
        <CampaignCreateNameInput
          v-if="currentStep.index === 0"
          :placeholder="currentStep.step?.inputPlaceholder"
          :onkeyup="handleEnter"
        />
        <CampaignCreateGoalAmountInput
          v-if="currentStep.index === 1"
          :placeholder="currentStep.step?.inputPlaceholder"
          :onkeyup="handleEnter"
        />
        <CampaignCreateDescriptionInput
          v-if="currentStep.index === 2"
          :placeholder="currentStep.step?.inputPlaceholder"
        />
        <CampaignCreateFileUpload
          v-if="currentStep.index === 3"
          :placeholder="currentStep.step?.inputPlaceholder"
          :onkeyup="handleEnter"
        />

        <div
          :class="[
            'px-2 text-red-500 animate-pulse duration-200 leading-5 overflow-hidden ease-out',
            errorMessage ? 'max-h-6 pt-1' : 'max-h-0 pt-0',
          ]"
        >
          {{ errorMessage }}
        </div>
      </template>
    </CampaignCreateStepWrapper>
  </div>
</template>

<script setup lang="ts">
import { useCampaignStore } from "~/stores/campaign.store";

const { currentStep, errorMessage } = storeToRefs(useCampaignStore());
const { incrementStep, decrementStep } = useCampaignStore();

function onContinue() {
  incrementStep();
  document.body.scrollTop = 0;
}
function onBack() {
  decrementStep();
  document.documentElement.scrollTop = 0;
}

function handleEnter(enter: KeyboardEvent) {
  if (enter.key !== "Enter") return;
  onContinue();
}
</script>
