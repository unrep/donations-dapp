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
        <CommonButton
          :class="[
            'px-0 w-full ',
            campaign.isOpen ? 'bg-red-500' : ' bg-green-500',
          ]"
          @click="stopCampaign"
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
              class="flex items-center justify-center"
            >
              <span>Stop</span>
            </span>
            <span v-else class="flex items-center justify-center">
              <span>Resume</span>
            </span>
          </transition>
        </CommonButton>

        <CommonButton
          :disabled="campaign.isOpen || +campaign.goal - +campaign.raised !== 0"
          class="px-0 w-full"
          @click="withdrawCampaign"
        >
          <transition v-bind="TransitionPrimaryButtonText" mode="out-in">
            <span
              v-if="withdrawalInProgress"
              class="flex items-center justify-center px-5"
            >
              <IconsLoadingDots width="1.5em" height="1.5em" />
            </span>
            <span v-else class="flex items-center justify-center">
              <span>Withdraw</span>
            </span>
          </transition>
        </CommonButton>
      </div>
      <div v-else class="w-full text-center text-indigo-500 text-lg">
        Campaign withdrawn
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useContractCampaignStore } from "~/stores/contract.campaign";

import type { Campaign } from "~/types";

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
