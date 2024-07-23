<template>
  <div class="flex flex-col items-center justify-center">
    <CommonBlobs />
    <NavBar />

    <div class="px-5 w-full flex flex-col items-center justify-center">
      <div
        class="max-w-7xl w-full text-center text-4xl font-bold mt-10 text-indigo-800"
      >
        Here you can manage your campaigns
      </div>

      <div
        class="mt-10 max-w-7xl bg-white bg-opacity-90 backdrop-blur-3xl rounded-3xl h-full w-full flex flex-wrap items-stretch justify-center gap-5 z-10 p-5 md:p-10"
      >
        <CampaignCardNoDonation
          v-for="campaign in campaigns"
          :key="campaign.id.toString()"
          :campaign="campaign"
          @refresh:campaigns="getCampaigns"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computedAsync } from "@vueuse/core";

import { useContractCampaign } from "~/composables/contract.campaign";
import { useOnboardStore } from "~/stores/onboard";
import { fetchIndexedCampaignsArray } from "~/utils/contract/fetchCampaigns";

const { isConnected, account } = storeToRefs(useOnboardStore());
const { getCampaignIdsByOrganizer } = useContractCampaign();

const campaignIds = computedAsync(async () => {
  if (!isConnected || !account.value.address) return [];
  const campaignIds = await getCampaignIdsByOrganizer(account.value.address);
  return campaignIds.map((id) => Number(id));
});

const { result: campaigns, execute: getCampaigns } = usePromise(
  () => {
    if (!campaignIds.value || !campaignIds.value.length)
      return Promise.resolve([]);
    return fetchIndexedCampaignsArray(campaignIds.value);
  },
  { cache: false },
);

watch(campaignIds, () => {
  if (isConnected.value) getCampaigns();
});
</script>
