<template>
  <div class="w-full text-center text-4xl font-bold text-indigo-800">
    This is how your campaign will look like
  </div>
  <div
    v-if="campaign"
    class="bg-indigo-500 bg-opacity-10 w-full mlg:w-[115%] scale-100 mlg:scale-[.85] rounded-[2rem] flex flex-col items-center justify-center preview-scale"
  >
    <CampaignFull :campaign="campaign" :preview="true" />
    <div
      class="w-full max-w-7xl p-5 text-left text-lg lg:grid gap-10"
      style="grid-template-columns: 7fr 3fr"
    >
      <CampaignDescription
        v-if="campaign"
        :description="campaign.description"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Campaign } from "~/types";

const { campaign } = defineProps<{
  campaign: Campaign;
}>();
</script>
