<template>
  <div
    class="relative w-full h-full min-h-screen flex flex-col mlg:grid grid-cols-[max-content_1fr] items-stretch justify-start"
  >
    <CampaignCreateSteps />

    <CampaignCreateStepWrapper :limit-size="campaignCreationStep === 'initial'">
      <template v-if="campaignCreationStep === 'initial'">
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
        v-else-if="campaignCreationStep === 'preview'"
        :campaign="getInputCampaign()"
      />

      <template v-else-if="campaignCreationStep === 'create-campaign'">
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

      <template v-else-if="campaignCreationStep === 'done'">
        <div />
        <div class="flex flex-col justify-center items-center gap-10">
          <div
            class="w-full text-center text-4xl mlg:text-5xl font-bold text-indigo-800"
          >
            Campaign created successfully!
          </div>

          <div class="w-full flex justify-center items-center gap-5">
            <NuxtLink
              :to="`/campaign?id=${campaignId}`"
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
        </div>
        <div />
      </template>

      <div
        v-if="campaignCreationStep !== 'done'"
        class="flex justify-center items-center gap-5 w-full"
      >
        <button
          v-if="campaignCreationStep !== 'initial'"
          ontouchstart=""
          tabindex="0"
          class="flex items-center justify-center gap-2 py-3 px-10 shadow-sm font-semibold border rounded-xl text-indigo-800 mlg:hover:scale-105 active:scale-105 duration-200"
          @click="onBack()"
        >
          <IconsArrow class="-rotate-90" />
          Back
        </button>

        <CommonButton :loading="false" @click="buttonState.func">
          <transition v-bind="TransitionPrimaryButtonText" mode="out-in">
            <span
              :key="buttonState.text"
              class="flex items-center justify-center"
            >
              <div v-if="isCampaignSending" class="px-5">
                <IconsLoadingDots width="1.5em" height="1.5em" />
              </div>
              <span v-else>{{ buttonState.text }}</span>
            </span>
          </transition>
        </CommonButton>
      </div>
    </CampaignCreateStepWrapper>
  </div>
</template>

<script setup lang="ts">
import "@toast-ui/editor/dist/toastui-editor.css";

import { useWindowScroll } from "@vueuse/core";

import type { Campaign } from "~/types";

import { useCampaignStore } from "~/stores/campaign";
import { useContractCampaign } from "~/composables/contract.campaign";
import { useOnboardStore } from "~/stores/onboard";
import { saveCampaignToLS } from "~/helpers/saveCampaignToLS";

const { getLastCampaignIndex } = useContractCampaign();

const { openModal } = useOnboardStore();
const { account } = storeToRefs(useOnboardStore());

const creationSteps = [
  "initial",
  "preview",
  "create-campaign",
  "done",
] as const;

const campaignCreationStep = ref<(typeof creationSteps)[number]>("initial");
const isCampaignSending = ref(false);
const { y: windowScrollTop } = useWindowScroll();

const buttonState = computed(() => {
  if (campaignCreationStep.value === "initial") {
    return {
      text: "Continue",
      func: () => {
        if (!checkAllStepsCompleted()) return;
        campaignCreationStep.value = "preview";
      },
    } as const;
  } else if (campaignCreationStep.value === "preview") {
    return {
      text: "Continue",
      func: () => {
        campaignCreationStep.value = "create-campaign";
      },
    } as const;
  } else if (!account.value.isConnected) {
    return {
      text: "Connect wallet",
      func: openModal,
    } as const;
  }
  return {
    text: "Create campaign",
    func: async () => {
      isCampaignSending.value = true;
      await sendCampaign()
        ?.then(async () => {
          campaignId.value = await getLastCampaignIndex().then((res) =>
            (res - 1).toString(),
          );
          saveCampaignToLS(getInputCampaign());
          navigateTo(`/campaign?id=${campaignId.value}`);
        })
        .finally(() => {
          isCampaignSending.value = false;
        });
      campaignCreationStep.value = "done";
    },
  } as const;
});

watch(campaignCreationStep, () => {
  windowScrollTop.value = 0;
});

function onBack() {
  const currentStepIndex = creationSteps.indexOf(campaignCreationStep.value);
  if (currentStepIndex > 0) {
    campaignCreationStep.value = creationSteps[currentStepIndex - 1];
  }
}

const { checkAllStepsCompleted, sendCampaign, steps } = useCampaignStore();
const { campaignId } = storeToRefs(useCampaignStore());

function getInputCampaign(): Campaign {
  return {
    id: BigInt(campaignId.value),
    title: steps[0].inputValue,
    image: URL.createObjectURL(steps[4].inputValue),
    raised: 0n,
    goal: decimalToBigNumber(steps[1].inputValue, ETH_TOKEN.decimals),
    description: steps[3].inputValue,
    // Mocking the date format as it is on chain
    createdAt: BigInt(Math.floor(new Date().getTime() / 1000)),
    filters: steps[2].inputValue,
    isOpen: true,
    isWithdrawn: false,
    organizer: account.value.address || "0x0",
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
