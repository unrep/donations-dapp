<template>
  <div>
    <NavBar />
    <CommonBlobs class="-z-10" />

    <div class="w-full flex flex-col justify-center items-center gap-16 py-10">
      <LandingCampaignSearchResultList
        v-if="latestCampaigns"
        class="z-10 -mt-8 px-5 max-w-7xl"
      >
        <div
          class="col-span-full z-10 text-4xl md:text-5xl font-bold text-indigo-800 text-left py-5 md:py-10"
        >
          A crypto powered fundraising service
        </div>

        <div
          class="col-span-full text-gray-700 w-full flex flex-col items-start justify-center gap-2 md:pb-5"
        >
          <CommonFiltersLoader v-if="filtersInProgress" />
          <CommonFiltersSelect
            v-else
            :filters="filters"
            :shorten="true"
            @update:select-item="onFilterSelect"
          />
        </div>
        <template v-if="campaignsInProgress">
          <CampaignCardLoader v-for="(_, index) in Array(5)" :key="index" />
        </template>
        <template v-else-if="filtersSelected && searchedCampaigns?.length">
          <CampaignCard
            v-for="campaign in searchedCampaigns"
            :key="campaign.title"
            :campaign="campaign"
          />
        </template>
        <template v-else-if="latestCampaigns.length && !filtersSelected">
          <div
            v-for="campaign in latestCampaigns"
            :key="campaign.title"
            class="flex flex-col gap-4 items-center justify-between mt-6"
          >
            <CampaignEvent :campaign="campaign" />
            <CampaignCard :campaign="campaign" />
          </div>
        </template>
        <template v-else>
          <div
            class="col-span-full min-h-96 w-full text-3xl font-bold text-indigo-800 flex flex-col gap-2 items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="6em"
              height="6em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M3.464 20.536C4.93 22 7.286 22 12 22c4.714 0 7.071 0 8.535-1.465C22 19.072 22 16.714 22 12s0-7.071-1.465-8.536C19.072 2 16.714 2 12 2S4.929 2 3.464 3.464C2 4.93 2 7.286 2 12c0 4.714 0 7.071 1.464 8.535"
                opacity="0.5"
              />
              <path
                fill="currentColor"
                d="M8.397 17.447a.75.75 0 0 0 1.05.155A4.267 4.267 0 0 1 12 16.75a4.27 4.27 0 0 1 2.553.852a.75.75 0 1 0 .894-1.204A5.766 5.766 0 0 0 12 15.25a5.766 5.766 0 0 0-3.447 1.148a.75.75 0 0 0-.156 1.049M15 12c.552 0 1-.672 1-1.5S15.552 9 15 9s-1 .672-1 1.5s.448 1.5 1 1.5m-6 0c.552 0 1-.672 1-1.5S9.552 9 9 9s-1 .672-1 1.5s.448 1.5 1 1.5"
              />
            </svg>
            No campaigns found
          </div>
        </template>
      </LandingCampaignSearchResultList>
    </div>

    <LandingFooter />
  </div>
</template>

<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import { useLandingStore } from "~/stores/landing";
import type { CampaignWEvents } from "~/types";
import {
  formatCampaignWEvents,
  getCampaignLatestContribution,
} from "~/utils/contract/campaignHelpers";

const {
  searchedCampaigns,
  searchedCampaignsInProgress,
  filters,
  filtersInProgress,
  latestCreatedCampaigns,
  latestCreatedCampaignsInProgress,
  latestContributedCampaigns,
  latestContributedCampaignsInProgress,
  contributionEvents,
} = storeToRefs(useLandingStore());
const {
  onFilterSelect,
  getFilters,
  getPreviewCampaigns,
  getLatestCreatedCampaigns,
  getContributionEvents,
} = useLandingStore();

onMounted(() => {
  getPreviewCampaigns();
  getFilters();
  getLatestCreatedCampaigns();
  getContributionEvents();
});

const filtersSelected = computed(() => {
  return !!filters.value?.find((filter) => filter.selected);
});

const latestCampaigns = computed(() => {
  const createdCamapaigns =
    latestCreatedCampaigns.value?.map((campaign) =>
      formatCampaignWEvents(campaign, "created"),
    ) || [];

  const contributedCamapaigns = latestContributedCampaigns.value?.map(
    (campaign) => {
      const latestContribution =
        contributionEvents.value &&
        getCampaignLatestContribution(campaign.id, contributionEvents.value);
      return formatCampaignWEvents(campaign, "contributed", latestContribution);
    },
  );

  const mergedCampaigns: CampaignWEvents[] = [
    ...createdCamapaigns,
    ...contributedCamapaigns,
  ];

  // Reduce the merged array to only unique campaigns based on campaignId, taking the latest
  return Object.values(
    mergedCampaigns.reduce(
      (acc: { [key: string]: CampaignWEvents }, campaign: CampaignWEvents) => {
        const campaignKey = campaign.id;
        if (acc[campaignKey.toString()]) {
          if (
            new Date(acc[campaignKey.toString()].eventTime) <
            new Date(campaign.eventTime)
          ) {
            acc[campaignKey.toString()] = campaign;
          }
        } else {
          acc[campaignKey.toString()] = campaign;
        }
        return acc;
      },
      {},
    ),
  ).sort(
    (a, b) => new Date(b.eventTime).getTime() - new Date(a.eventTime).getTime(),
  );
});

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const campaignsInProgress = computedAsync(async () => {
  // Using a delay, to make ui not flicker
  const result =
    latestCreatedCampaignsInProgress.value ||
    latestContributedCampaignsInProgress.value ||
    searchedCampaignsInProgress.value;

  if (!result) await delay(300);

  return result;
});

// watch(
//   [
//     latestCreatedCampaignsInProgress,
//     latestContributedCampaignsInProgress,
//     searchedCampaignsInProgress,
//   ],
//   async () => {
//     console.log(
//       "setting campaignsInProgress to watch",
//       latestCreatedCampaignsInProgress.value ||
//         latestContributedCampaignsInProgress.value ||
//         searchedCampaignsInProgress.value,
//     );

//     await delay(300);

//     campaignsInProgress.value =
//       latestCreatedCampaignsInProgress.value ||
//       latestContributedCampaignsInProgress.value ||
//       searchedCampaignsInProgress.value;
//   },
// );
</script>
