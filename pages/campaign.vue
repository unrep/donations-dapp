<template>
  <div class="flex flex-col items-center justify-center">
    <div class="w-full flex flex-col items-center justify-center">
      <CommonBlobs />
      <CommonLatestContributionsSlider />
      <NavBar />

      <CampaignFullLoader v-if="campaignInProgress" />
      <CampaignFull
        v-else-if="campaign"
        :key="campaign?.id"
        :campaign="campaign"
        @refresh:campaign="reloadCampaign"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";

import { fetchCampaign } from "~/utils/contract/fetchCampaigns";

import type { Campaign } from "~/types";

const route = useRoute();
const router = useRouter();
const campaign = ref<Campaign | undefined>(undefined);
const campaignId = ref<number | undefined>(undefined);

onMounted(async () => {
  campaignId.value = Number(route.query.id);
  await setCampaign();
});

const {
  execute: setCampaign,
  reload: reloadCampaign,
  inProgress: campaignInProgress,
} = usePromise(async () => {
  if (campaignId.value === undefined || isNaN(campaignId.value)) {
    router.push("/");
    return;
  }

  try {
    campaign.value = undefined;
    campaign.value = await fetchCampaign(campaignId.value);
  } catch (error) {
    router.push("/");
  }
});
</script>

<style scoped lang="scss">
.raised-percentage-width {
  width: var(--raised-percentage);
}
</style>
