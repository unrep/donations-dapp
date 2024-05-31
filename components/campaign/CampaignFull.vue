<template>
  <div
    :class="[
      'w-full max-w-7xl p-5 flex flex-col grid-cols-2 flex-nowrap gap-5 justify-items-stretch',
      preview ? '2xl:grid xl:p-10 xl:gap-10' : 'lg:grid md:p-10 md:gap-10',
    ]"
    style="grid-template-columns: 7fr 3fr"
  >
    <div
      :class="[
        'flex-grow flex flex-col items-center justify-center gap-5 ',
        preview ? 'xl:gap-10' : 'md:gap-10',
      ]"
    >
      <div
        :class="[
          'w-full text-3xl font-bold text-indigo-800',
          preview ? 'xl:text-4xl 3xl:text-5xl' : 'md:text-4xl xl:text-5xl',
        ]"
      >
        {{ campaign.title }}
      </div>

      <img
        class="rounded-3xl w-full h-full aspect-video object-cover object-center relative"
        :src="campaign.image"
        alt="campaign"
      />
    </div>

    <div
      :class="[
        'h-full w-full shadow-md bg-opacity-40 backdrop-blur-sm bg-white rounded-3xl py-5 px-5 gap-10 flex flex-col justify-center items-center',
        preview ? '2xl:items-start' : 'lg:items-start',
      ]"
    >
      <div
        class="gap-5 w-full h-full flex flex-col items-start justify-start px-2 pt-2"
      >
        <div class="text-xl">
          Started at
          {{
            campaign?.createdAt
              ? formatDate(campaign?.createdAt, "Do MMM YYYY")
              : ""
          }}
        </div>

        <div class="w-full">
          <div class="w-full text-2xl font-semibold px-1">
            {{ raisedUSD }}
            <span class="font-normal text-base">raised of {{ goalUSD }}</span>
          </div>

          <div class="w-full text-center">
            <div class="w-full rounded-full overflow-hidden h-3 bg-gray-300">
              <div
                class="raised-percentage-width h-full bg-indigo-800 rounded-full"
                :style="{ '--raised-percentage': `${raisedPercentage}%` }"
              />
            </div>
          </div>
        </div>

        <div class="text-xl text-black">
          <span class="text-2xl">{{ campaign.donationsCount }}</span>
          donations in last 30 days
        </div>
      </div>

      <button
        to="/create-campaign"
        :class="[
          'self-end w-full text-2xl font-black bg-indigo-800 text-white text-center px-10 py-3 rounded-2xl duration-200 cursor-pointer hover:scale-105',
          preview ? 'xl:w-max 2xl:w-full' : 'md:w-max lg:w-full',
        ]"
        :disabled="preview"
        @click="modalOpened = !modalOpened"
      >
        Donate
      </button>
    </div>

    <div class="w-full flex flex-col justify-center items-start gap-5">
      <div class="text-3xl font-semibold">Campaign description</div>
      <CommonRichViewer :content="campaign.description" />
    </div>
  </div>

  <CampaignDonationModal
    :is-open="modalOpened"
    @update:is-open="(value) => (modalOpened = value)"
  />
</template>

<script setup lang="ts">
import { formatDate } from "@vueuse/core";

import { type Campaign } from "~/types";

const modalOpened = ref(false);

const { campaign } = defineProps({
  campaign: {
    type: Object as () => Campaign,
    required: true,
  },
  preview: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const goalUSD = computed(() => computeETHPrice(campaign.goal));
const raisedUSD = computed(() => computeETHPrice(campaign.raised));

const raisedPercentage = computed(() =>
  Math.floor((+campaign.raised / +campaign.goal) * 100),
);
</script>
