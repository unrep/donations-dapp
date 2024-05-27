<template>
  <div class="flex flex-col items-center justify-center">
    <div class="w-full flex flex-col items-center justify-center">
      <CommonBlobs />
      <NavBar />
      <CampaignFull v-if="campaign" :campaign="campaign" />
    </div>
    <div
      class="w-full max-w-7xl p-5 text-left text-lg lg:grid gap-10"
      style="grid-template-columns: 7fr 3fr"
    >
      <CampaignDescription
        v-if="campaign"
        :description="campaign.description"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";

import { campaigns } from "~/mockCampaigns";

import type { Campaign } from "~/types";

const route = useRoute();
const router = useRouter();

const campaign = ref<Campaign | null>(null);

onMounted(() => {
  if (!route.query.id) {
    router.push("/");
  }

  campaign.value = campaigns.find((c) => c.id === route.query.id) ?? null;
});
</script>

<style scoped lang="scss">
.raised-percentage-width {
  width: var(--raised-percentage);
}
</style>
~/mockCampaigns
