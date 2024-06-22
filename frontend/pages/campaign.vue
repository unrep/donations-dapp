<template>
  <div class="flex flex-col items-center justify-center">
    <div class="w-full flex flex-col items-center justify-center">
      <CommonBlobs />
      <NavBar />

      <CampaignFullLoader v-if="!campaign && campaignInProgress" />
      <CampaignFull
        v-else-if="campaign"
        :key="campaign?.id"
        :campaign="campaign"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

import { useContractCampaignStore } from "~/stores/contract.campaign";
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
    if (campaignId.value === undefined || isNaN(campaignId.value)) {
      return router.push("/");
    }
    await fetchCampaign();
  },
  { immediate: true },
);

const { watchContributions } = useContractCampaignStore();

watchContributions((logs) => {
  if (
    !campaign.value?.id &&
    Number(logs[0].args.campaignId) !== Number(campaign.value?.id)
  )
    return;

  fetchCampaign();
});
</script>

<style scoped lang="scss">
.raised-percentage-width {
  width: var(--raised-percentage);
}
</style>
