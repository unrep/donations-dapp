<template>
  <div
    v-if="campaign.createdAt && campaign.eventType === 'created'"
    class="flex-grow flex items-center justify-center gap-2"
  >
    <CommonAccountView :address="campaign.organizer" />
    <div class="text-sm">created campaign</div>
    {{ formatDateAgo(bigIntToDate(campaign.createdAt)) }}
  </div>
  <div
    v-else-if="
      campaign.eventType === 'contributed' && campaign.latestContribution
    "
    class="flex-grow flex flex-wrap justify-center items-center gap-1"
  >
    <CommonAccountView :address="campaign.latestContribution.contributor" />
    <div class="text-sm">donated</div>

    <div>
      {{ computeETHPrice(campaign.latestContribution.amount) }}
    </div>
    <div>
      {{ formatDateAgo(bigIntToDate(campaign.latestContribution.timestamp)) }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CampaignWEvents } from "~/types";

defineProps({
  campaign: {
    type: Object as () => CampaignWEvents,
    required: true,
  },
});
</script>
