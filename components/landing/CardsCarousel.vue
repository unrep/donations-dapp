<template>
  <div
    class="w-full flex gap-5 pb-5 items-center justify-start snap-mandatory snap-x overflow-x-auto overflow-y-visible hide-scrollbar"
  >
    <LandingCampaignCard
      v-for="campaign in campaigns"
      :key="campaign.id"
      :campaign="campaign"
    />
  </div>
</template>

<script lang="ts" setup>
import campaigns from "~/mockCampaigns.json";
</script>
