<template>
  <div
    class="w-full h-full min-h-screen flex flex-col mlg:grid grid-cols-2 items-stretch justify-center"
    style="grid-template-columns: max-content 1fr"
  >
    <CampaignCreateSteps class="z-20" />

    <CampaignCreateStepWrapper class="z-10">
      <div class="w-full space-y-1">
        <div class="font-medium">{{ steps[0].shortStepName }}</div>
        <CampaignCreateNameInput
          :placeholder="steps[0].inputPlaceholder"
          :onkeyup="handleEnter"
        />
        <CampaignCreateErrorMessage
          v-if="steps[0].errorShow"
          :error-message="steps[0].errorMessage"
        />
      </div>

      <div class="w-full space-y-1">
        <div class="font-medium">{{ steps[1].shortStepName }}</div>
        <CampaignCreateGoalAmountInput
          :placeholder="steps[1].inputPlaceholder"
          :onkeyup="handleEnter"
        />
        <CampaignCreateErrorMessage
          v-if="steps[1].errorShow"
          :error-message="steps[1].errorMessage"
        />
      </div>

      <div class="w-full space-y-1">
        <div class="font-medium">{{ steps[2].shortStepName }}</div>
        <CampaignCreateDescriptionInput
          :placeholder="steps[2].inputPlaceholder"
          :onkeyup="handleEnter"
        />
        <CampaignCreateErrorMessage
          v-if="steps[2].errorShow"
          :error-message="steps[2].errorMessage"
        />
      </div>

      <div class="w-full space-y-1">
        <div class="font-medium">{{ steps[3].shortStepName }}</div>
        <CampaignCreateFileUpload
          :placeholder="steps[3].inputPlaceholder"
          :onkeyup="handleEnter"
        />
        <CampaignCreateErrorMessage
          v-if="steps[3].errorShow"
          :error-message="steps[3].errorMessage"
        />
      </div>
    </CampaignCreateStepWrapper>
  </div>
</template>

<script setup lang="ts">
import { useCampaignStore } from "~/stores/campaign.store";

const { steps } = storeToRefs(useCampaignStore());

function onContinue() {}

function handleEnter(enter: KeyboardEvent) {
  if (enter.key !== "Enter") return;
  onContinue();
}
</script>
