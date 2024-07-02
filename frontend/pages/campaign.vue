<template>
  <div class="flex flex-col items-center justify-center">
    <div class="w-full flex flex-col items-center justify-center">
      <CommonBlobs />
      <NavBar />

      <CampaignFullLoader v-if="!campaign && campaignInProgress" />
      <CampaignFull
        v-else-if="campaign"
        :key="campaign?.id.toString()"
        :campaign="campaign"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getCampaignFromLS } from "~/helpers/saveCampaignToLS";

import { useContractCampaignStore } from "~/stores/contract.campaign";
import { useLandingStore } from "~/stores/landing";
import { fetchCampaign as fetchCampaignFromContract } from "~/utils/contract/fetchCampaigns";

const route = useRoute();
const router = useRouter();
const campaignId = ref<number | undefined>(undefined);

const {
  result: campaign,
  execute: fetchCampaign,
  inProgress: campaignInProgress,
} = usePromise(() => fetchCampaignFromContract(campaignId.value!), {
  cache: false,
});

watch(
  () => route.query.id,
  async (id) => {
    campaignId.value = Number(id);
    if (isNaN(campaignId.value)) {
      return router.push("/");
    }
    try {
      const lsCampaign = getCampaignFromLS();
      if (lsCampaign && Number(lsCampaign.id) === campaignId.value) {
        campaign.value = lsCampaign;
      }
    } catch (e) {
      console.log(e);
    }
    await fetchCampaign();
    await getContributionEvents();
  },
  { immediate: true },
);

const { watchContributions } = useContractCampaignStore();
const { getContributionEvents } = useLandingStore();

watchContributions((logs) => {
  if (
    !campaign.value?.id &&
    Number(logs[0].args.campaignId) !== Number(campaign.value?.id)
  )
    return;

  setTimeout(() => {
    fetchCampaign().then(() => getContributionEvents());
  }, 2000);
});
</script>

<style scoped lang="scss">
.raised-percentage-width {
  width: var(--raised-percentage);
}
</style>
