<template>
  <textarea
    v-model="description"
    rows="5"
    class="w-full border border-gray-300 outline-indigo-500 rounded-lg font-thin shadow-sm text-lg px-4 py-2 resize-none"
  />
</template>

<script setup lang="ts">
import { useCampaignStore } from "~/stores/campaign.store";
const { description } = storeToRefs(useCampaignStore());
</script>
