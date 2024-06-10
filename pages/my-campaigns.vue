<template>
  <div class="flex flex-col items-center justify-center">
    <div class="w-full flex flex-col items-center justify-center">
      <CommonBlobs />
      <NavBar />

      <div
        class="max-w-7xl w-full text-center text-4xl font-semibold mt-10 text-indigo-800"
      >
        Here you can manage your campaigns
      </div>

      <div
        class="max-w-7xl h-full w-full flex flex-wrap items-stretch justify-center gap-5 z-10 p-10"
      >
        <CampaignCardNoDonation
          v-for="campaign in campaigns"
          :key="campaign.id"
          :campaign="campaign"
          @refresh:campaigns="reloadCampaigns"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computedAsync } from "@vueuse/core";

import { useContractCampaignStore } from "~/stores/contract.campaign";
import { useOnboardStore } from "~/stores/onboard";
import { fetchIndexedCampaignsArray } from "~/utils/contract/fetchCampaigns";

const { isConnected, account } = storeToRefs(useOnboardStore());
const { getCampaignIdsByOrganizer } = useContractCampaignStore();

const campaignIds = computedAsync(async () => {
  if (!isConnected || !account.value.address) return [];
  const campaignIds = await getCampaignIdsByOrganizer(account.value.address);
  return campaignIds.map((id) => Number(id));
});

const {
  result: campaigns,
  execute: getCampaigns,
  reload: reloadCampaigns,
} = usePromise(() => {
  if (!campaignIds.value || !campaignIds.value.length)
    return Promise.resolve([]);
  return fetchIndexedCampaignsArray(campaignIds.value);
});

watch(campaignIds, () => {
  if (isConnected.value) getCampaigns();
});
</script>
