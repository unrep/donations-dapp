<template>
  <div
    class="bg-white w-full relative group flex flex-col items-center justify-between from-gray-100 bg-gradient-to-br shadow-lg rounded-3xl overflow-hidden hover:border-indigo-800 hover:border-2 duration-300"
  >
    <img
      class="z-10 w-full max-h-[50%] h-full aspect-video object-cover object-center relative group-hover:scale-[2.5] group-hover:translate-y-1/2 duration-500 ease-in-out"
      :src="image"
      alt="campaign"
    />
    <div
      class="flex-grow z-0 overflow-hidden w-full group-hover:opacity-0 delay-200 group-hover:delay-0 flex flex-col items-start justify-between gap-6 p-5 duration-500"
    >
      <div class="text-xl font-bold">{{ title }}</div>

      <div class="w-full">
        <CommonCampaignProgress :campaign="campaign" />
      </div>
    </div>

    <div
      class="z-20 overflow-hidden p-5 absolute bg-opacity-70 backdrop-blur-md flex gap-5 flex-col items-center justify-between -top-full group-hover:-top-0 left-0 w-full h-full bg-white duration-500 ease-in-out"
    >
      <div class="text-xl font-bold">{{ title }}</div>

      <CommonRichViewer
        class="max-h-60 overflow-hidden"
        :content="description"
      />

      <div
        class="w-full translate-y-[200%] group-hover:translate-y-0 delay-[400ms] duration-200"
      >
        <button
          class="shadow-lg font-semibold w-full px-5 py-2 bg-indigo-800 text-white rounded-xl hover:scale-105 duration-200"
          @click="router.push(`/campaign?id=${campaign.id}`)"
        >
          See campaign page
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

import type { Campaign } from "~/types";

const { campaign } = defineProps<{
  campaign: Campaign;
}>();
const router = useRouter();

const { title, image, description } = campaign;
</script>
