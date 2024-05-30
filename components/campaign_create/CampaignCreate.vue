<template>
  <div
    class="relative w-full h-full min-h-screen flex flex-col mlg:grid grid-cols-2 items-stretch justify-start"
    style="grid-template-columns: max-content 1fr"
  >
    <CampaignCreateSteps />

    <CampaignCreateStepWrapper
      ref="stepWrapper"
      :limit-size="campaignCreationStep === 0"
      :on-continue="onContinue"
    >
      <template v-if="campaignCreationStep === 0">
        <div
          v-for="step in steps"
          :key="step.stepName"
          class="w-full space-y-1"
        >
          <div class="font-medium">{{ step.stepName }}</div>
          <component
            :is="step.component"
            v-bind="step.props"
            @update:model-value="step.events?.onInput"
          />
          <CampaignCreateErrorMessage
            v-if="step.showErrorMessage"
            :error-message="step.errorMessage"
          />
        </div>
      </template>

      <CampaignPreview
        v-else-if="campaignCreationStep === 1"
        :campaign="campaign"
      />

      <template v-else-if="campaignCreationStep === 2">
        <div />
        <div
          class="w-full text-center text-4xl mlg:text-5xl font-bold text-indigo-800"
        >
          Campaign created successfully!
        </div>

        <div class="flex gap-5">
          <NuxtLink
            :to="`/campaign?id=${campaign.id}`"
            class="text-base py-3 px-5 shadow-xl bg-indigo-800 font-semibold rounded-xl text-white mlg:hover:scale-105 active:scale-105 duration-200"
          >
            Your campaign
          </NuxtLink>

          <NuxtLink
            to="/"
            class="text-base py-3 px-10 shadow-xl bg-indigo-800 font-semibold rounded-xl text-white mlg:hover:scale-105 active:scale-105 duration-200"
          >
            Home
          </NuxtLink>
        </div>
      </template>

      <div
        v-if="campaignCreationStep < 2"
        class="flex justify-center items-center gap-5 w-full"
      >
        <button
          v-if="campaignCreationStep > 0"
          ontouchstart=""
          tabindex="0"
          class="flex items-center justify-center gap-2 py-3 px-10 shadow-xl font-semibold border rounded-xl text-indigo-800 mlg:hover:scale-105 active:scale-105 duration-200"
          @click="onBack()"
        >
          <IconsArrow class="-rotate-90" />
          Back
        </button>

        <button
          ontouchstart=""
          tabindex="0"
          class="py-3 px-10 shadow-xl bg-indigo-800 font-semibold rounded-xl text-white mlg:hover:scale-105 active:scale-105 duration-200"
          @click="onContinue()"
        >
          Continue
        </button>
      </div>

      <div class="hidden mlg:block h-5 border border-transparent w-full"></div>
    </CampaignCreateStepWrapper>
  </div>
</template>

<script setup lang="ts">
import { useCampaignStore } from "~/stores/campaign";
import { useOnboardStore } from "~/stores/onboard";

import type { VNodeRef } from "vue";
import type { Campaign } from "~/types";

const { openModal } = useOnboardStore();
const { account, web3ModalOpened } = storeToRefs(useOnboardStore());

const stepWrapper = ref<VNodeRef | undefined>(undefined);

const campaignCreationStep = ref(0);
async function onContinue() {
  if (!checkAllStepsCompleted()) return;
  stepWrapper.value?.scrollUp();

  switch (campaignCreationStep.value) {
    case 0:
      campaignCreationStep.value++;
      break;
    case 1:
      !account.value.isConnected && (await openModal());

      while (web3ModalOpened.value) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      if (account.value.isConnected) {
        await sendCampaign();
        campaignCreationStep.value++;
      }
      break;
    case 2:
      campaignCreationStep.value++;
      break;
    default:
      break;
  }
}

function onBack() {
  stepWrapper.value?.scrollUp();
  campaignCreationStep.value > 0 && campaignCreationStep.value--;
}

const { checkAllStepsCompleted, sendCampaign, steps } = useCampaignStore();

const campaign = computed(() => {
  return {
    id: "0",
    title: "Campaign Title",
    image: "fundraising.webp",
    raised: 0,
    goal: 1,
    description: "Campaign Description",
    createdAt: new Date(),
    donationsCount: 0,
  } as Campaign;
});

const inputs = ref<HTMLCollectionOf<HTMLInputElement | HTMLTextAreaElement>>();

onMounted(() => {
  inputs.value = document.getElementsByClassName("create-campaign-input") as
    | HTMLCollectionOf<HTMLInputElement>
    | HTMLCollectionOf<HTMLTextAreaElement>;

  if (inputs.value.length > 0) inputs.value[0].focus();
});
</script>
