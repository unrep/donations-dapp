<template>
  <input
    v-model="campaignName"
    type="text"
    maxlength="30"
    class="w-full border border-gray-300 outline-indigo-800 rounded-lg font-thin shadow-sm px-4 py-2"
  />
</template>

<script setup lang="ts">
import { useCampaignStore } from "~/stores/campaign.store";
const { campaignName } = storeToRefs(useCampaignStore());
</script>
