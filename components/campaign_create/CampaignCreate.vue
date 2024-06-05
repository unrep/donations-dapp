<template>
  <div
    class="relative w-full h-full min-h-screen flex flex-col mlg:grid grid-cols-2 items-stretch justify-start"
    style="grid-template-columns: max-content 1fr"
  >
    <CampaignCreateSteps />

    <CampaignCreateStepWrapper
      ref="stepWrapper"
      :limit-size="campaignCreationStep === 0"
    >
      <template v-if="campaignCreationStep === 0">
        <div
          v-for="step in steps"
          :key="step.stepName"
          :class="[
            'w-full space-y-1',
            step.stepName === 'Campaign filters' && 'z-9999',
          ]"
        >
          <div class="font-medium">{{ step.stepName }}</div>
          <component
            :is="step.component"
            v-bind="step.props"
            @update:model-value="step.events?.onInput"
            @update:select-item="step.events?.onSelect"
          />
          <CampaignCreateErrorMessage
            v-if="step.showErrorMessage"
            :error-message="step.errorMessage"
          />
        </div>
      </template>

      <CampaignPreview
        v-else-if="campaignCreationStep === 1"
        :campaign="getInputCampaign()"
      />

      <template v-else-if="campaignCreationStep === 2">
        <div />
        <div
          v-if="!account.isConnected"
          class="w-full text-center text-4xl mlg:text-5xl font-bold text-indigo-800"
        >
          You need to connect your wallet first
        </div>
        <div
          v-else
          class="w-full text-center text-4xl mlg:text-5xl font-bold text-indigo-800"
        >
          Now you can create the campaign
        </div>
      </template>

      <template v-else-if="campaignCreationStep === 3">
        <div />
        <div
          class="w-full text-center text-4xl mlg:text-5xl font-bold text-indigo-800"
        >
          Campaign created successfully!
        </div>

        <div class="w-full flex justify-center items-center gap-5">
          <NuxtLink
            :to="`/campaign?id=${0}`"
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
        v-if="campaignCreationStep < 3"
        class="flex justify-center items-center gap-5 w-full"
      >
        <button
          v-if="campaignCreationStep > 0"
          ontouchstart=""
          tabindex="0"
          class="flex items-center justify-center gap-2 py-3 px-10 shadow-sm font-semibold border rounded-xl text-indigo-800 mlg:hover:scale-105 active:scale-105 duration-200"
          @click="onBack()"
        >
          <IconsArrow class="-rotate-90" />
          Back
        </button>

        <CommonButton :loading="false" @click="addTokenStep.func">
          <transition v-bind="TransitionPrimaryButtonText" mode="out-in">
            <span
              v-if="addTokenStep.key === 'connect-wallet'"
              class="flex items-center justify-center"
            >
              <span>Connect Wallet</span>
            </span>
            <span
              v-else-if="addTokenStep.key === 'preview'"
              class="flex items-center justify-center"
            >
              Continue
            </span>
            <span
              v-else-if="addTokenStep.key === 'create-campaign'"
              class="flex items-center justify-center"
            >
              Create Campaign
            </span>
            <span
              v-else-if="addTokenStep.key === 'loading'"
              class="flex items-center justify-center px-5"
            >
              <IconsLoadingDots width="1.5em" height="1.5em" />
            </span>
          </transition>
        </CommonButton>
      </div>
      <div
        v-if="campaignCreationStep < 2"
        class="hidden mlg:block h-5 border border-transparent w-full"
      ></div>
    </CampaignCreateStepWrapper>
  </div>
</template>

<script setup lang="ts">
import "@toast-ui/editor/dist/toastui-editor.css";

import { useCampaignStore } from "~/stores/campaign";
import { useOnboardStore } from "~/stores/onboard";

import type { VNodeRef } from "vue";

const { openModal } = useOnboardStore();
const { account } = storeToRefs(useOnboardStore());
const stepWrapper = ref<VNodeRef | undefined>(undefined);
const campaignCreationStep = ref(0);
const isCampaignSending = ref(false);

const addTokenStep = computed(() => {
  if (isCampaignSending.value) {
    return {
      key: "loading",
      func: () => null,
    } as const;
  }
  if (campaignCreationStep.value < 2) {
    return {
      key: "preview",
      func: () => {
        if (!checkAllStepsCompleted()) return;
        stepWrapper.value?.scrollUp();
        campaignCreationStep.value++;
      },
    } as const;
  } else if (!account.value.isConnected) {
    return {
      key: "connect-wallet",
      func: openModal,
    } as const;
  }
  return {
    key: "create-campaign",
    func: async () => {
      isCampaignSending.value = true;
      await sendCampaign()?.finally(() => (isCampaignSending.value = false));
      campaignCreationStep.value++;
    },
  } as const;
});

function onBack() {
  stepWrapper.value?.scrollUp();
  campaignCreationStep.value > 0 && campaignCreationStep.value--;
}

const { checkAllStepsCompleted, sendCampaign, steps } = useCampaignStore();

function getInputCampaign() {
  return {
    id: "0",
    title: steps[0].inputValue,
    image: URL.createObjectURL(steps[4].inputValue),
    raised: "0",
    goal: steps[1].inputValue,
    description: steps[3].inputValue,
    createdAt: new Date(),
    donationsCount: 0,
  };
}

const inputs = ref<HTMLCollectionOf<HTMLInputElement | HTMLTextAreaElement>>();

onMounted(() => {
  inputs.value = document.getElementsByClassName("create-campaign-input") as
    | HTMLCollectionOf<HTMLInputElement>
    | HTMLCollectionOf<HTMLTextAreaElement>;

  if (inputs.value.length > 0) inputs.value[0].focus();
});
</script>
