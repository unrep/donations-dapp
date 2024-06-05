<template>
  <div
    class="max-w-7xl h-full w-full flex flex-wrap items-stretch justify-center gap-5"
  >
    <CampaignCard
      v-for="campaign in campaigns"
      :key="campaign.title"
      :campaign="campaign"
    />
  </div>
</template>

<script lang="ts" setup>
import type { Campaign } from "~/types";

defineProps({
  campaigns: Array<Campaign>,
});
</script>
~
