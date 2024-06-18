<template>
  <div
    class="bg-white w-full max-w-xs relative flex flex-col items-center justify-between from-gray-100 bg-gradient-to-br shadow-lg rounded-3xl overflow-hidden duration-300"
  >
    <img
      class="z-10 w-full max-h-[50%] h-full aspect-video object-cover object-center relative duration-500 ease-in-out"
      :src="image"
      alt="campaign"
    />
    <div
      class="flex-grow z-0 w-full delay-200 flex flex-col items-start justify-between gap-6 p-5 duration-500"
    >
      <div class="text-xl font-bold">{{ title }}</div>

      <div class="w-full">
        <CommonCampaignProgress :campaign="campaign" />
      </div>

      <div
        v-if="!campaign.isWithdrawn"
        class="w-full flex flex-wrap gap-5 items-center justify-center"
      >
        <button
          class="px-2 py-1 border border-gray-400 rounded-lg hover:scale-105 duration-200 cursor-pointer"
          @click="stopCampaign()"
        >
          <transition v-bind="TransitionPrimaryButtonText" mode="out-in">
            <span
              v-if="stopInProgress"
              class="flex items-center justify-center px-5"
            >
              <IconsLoadingDots width="1.5em" height="1.5em" />
            </span>
            <span
              v-else-if="campaign.isOpen"
              class="flex items-center justify-center gap-1"
            >
              <IconsPause color="black" />
              <span>Stop</span>
            </span>
            <span v-else class="flex items-center justify-center gap-1">
              <IconsResume color="black" />
              <span>Resume</span>
            </span>
          </transition>
        </button>

        <button
          :disabled="campaign.isOpen || +campaign.goal - +campaign.raised !== 0"
          class="px-2 py-1 border border-gray-400 rounded-lg hover:scale-105 duration-200 cursor-pointer"
          @click="withdrawCampaign()"
        >
          <transition v-bind="TransitionPrimaryButtonText" mode="out-in">
            <span
              v-if="withdrawalInProgress"
              class="flex items-center justify-center px-5"
            >
              <IconsLoadingDots width="1.5em" height="1.5em" />
            </span>
            <span v-else class="flex items-center justify-center gap-1">
              <IconsArrowBold class="rotate-180" size="1.2rem" color="black" />
              <span>Withdraw</span>
            </span>
          </transition>
        </button>
      </div>
      <div v-else class="w-full text-center text-indigo-500 text-lg">
        Campaign withdrawn
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Campaign } from "~/types";

import { useContractCampaignStore } from "~/stores/contract.campaign";

const { campaign } = defineProps<{
  campaign: Campaign;
}>();

const emit = defineEmits<{
  (eventName: "refresh:campaigns"): void;
}>();

const { title, image } = campaign;

const { withdrawCampaignFunds, stopCampaign: stopCampaignContract } =
  useContractCampaignStore();

const { inProgress: withdrawalInProgress, execute: withdrawCampaign } =
  usePromise(() =>
    withdrawCampaignFunds(+campaign.id).finally(() =>
      emit("refresh:campaigns"),
    ),
  );

const { inProgress: stopInProgress, execute: stopCampaign } = usePromise(() =>
  stopCampaignContract(+campaign.id).finally(() => emit("refresh:campaigns")),
);
</script>
