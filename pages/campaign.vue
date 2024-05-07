<template>
  <div class="flex flex-col items-center justify-center">
    <div
      class="w-full bg-radial-base flex flex-col items-center justify-center"
    >
      <NavBar />

      <div
        class="w-full max-w-7xl p-5 md:px-5 md:py-10 flex flex-col lg:grid grid-flow-col gap-5 md:gap-10 items-center justify-between"
        style="grid-template-columns: 7fr 3fr"
      >
        <div class="flex flex-col items-center justify-center gap-5 md:gap-10">
          <div
            class="w-full text-3xl md:text-4xl xl:text-5xl font-bold text-indigo-800"
          >
            {{ campaign.title }}
          </div>

          <img
            class="rounded-3xl w-full h-full aspect-video object-cover object-center relative"
            :src="campaign.image"
            alt="campaign"
          />
        </div>

        <div
          class="h-full w-full lg:w-max shadow-md bg-opacity-40 backdrop-blur-sm bg-white rounded-3xl lg:rounded-[2.5rem] p-5 pt-5 gap-10 flex flex-col justify-center items-center lg:items-start"
        >
          <div
            class="gap-5 w-full h-full flex flex-col items-start justify-start px-2 pt-2"
          >
            <div class="text-xl">
              Started at
              {{
                campaign?.createdAt
                  ? formatDate(campaign?.createdAt, "Do MMM YYYY")
                  : ""
              }}
            </div>

            <div class="w-full">
              <div class="w-full text-2xl font-semibold px-1">
                {{ raised }} ETH
                <span class="font-normal text-base"
                  >raised of {{ goal }} ETH</span
                >
              </div>

              <div class="w-full text-center">
                <div
                  class="w-full rounded-full overflow-hidden h-3 bg-gray-300"
                >
                  <div
                    class="raised-percentage-width h-full bg-indigo-800 rounded-full"
                    :style="{ '--raised-percentage': `${raisedPercentage}%` }"
                  />
                </div>
              </div>
            </div>

            <div class="text-xl text-black">
              <span class="text-2xl">{{ campaign.donationsCount }}</span>
              donations in last 30 days
            </div>
          </div>

          <button
            to="/create-campaign"
            class="self-end w-full md:w-max lg:w-full text-2xl font-black bg-indigo-800 text-white text-center px-10 py-3 rounded-full duration-200 cursor-pointer hover:scale-105"
          >
            Donate
          </button>
        </div>
      </div>
    </div>

    <div
      class="w-full max-w-7xl p-5 text-left text-lg lg:grid gap-10"
      style="grid-template-columns: 7fr 3fr"
    >
      <div class="w-full flex flex-col justify-center items-start gap-5">
        <div class="text-3xl font-semibold">Campaign description</div>

        {{ campaign.description }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { formatDate } from "@vueuse/core";
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";

import { campaigns } from "~/mockCampaigns";

const route = useRoute();
const router = useRouter();

const campaignId = ref<string>(route.query.id as string);

const campaign = campaigns[1];

const { goal, raised } = campaign;

const raisedPercentage = computed(() =>
  Math.floor((campaign.raised / campaign.goal) * 100),
);

onMounted(() => {
  if (!route.query.id) {
    router.push("/");
  }

  campaignId.value = route.query.id as string;
});
</script>

<style scoped lang="scss">
.raised-percentage-width {
  width: var(--raised-percentage);
}
</style>
~/mockCampaigns
