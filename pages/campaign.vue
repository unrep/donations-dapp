<template>
  <div class="flex flex-col items-center justify-center">
    <div class="w-full flex flex-col items-center justify-center">
      <CommonBlobs />
      <NavBar />
      <CampaignFull v-if="campaign" :campaign="campaign" />
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
const error = ref<Error | undefined>(undefined);
const inProgress = ref<boolean>(false);

onMounted(async () => {
  const campaignId = Number(route.query.id);

  if (isNaN(campaignId)) {
    router.push("/");
    return;
  }

  const {
    execute: getCampaign,
    error,
    inProgress,
  } = usePromise(() => {
    return fetchCampaign(campaignId);
  });

  campaign.value = await getCampaign();
});
</script>

<style scoped lang="scss">
.raised-percentage-width {
  width: var(--raised-percentage);
}
</style>
