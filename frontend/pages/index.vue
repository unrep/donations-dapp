<template>
  <div>
    <NavBar />
    <LandingHero />

    <div
      class="w-full bg-white flex flex-col justify-center items-center gap-16 pb-10"
    >
      <div
        class="text-gray-700 p-16 pb-0 w-full flex flex-col items-start md:items-center justify-center gap-4"
      >
        <div class="text-4xl font-semibold">Latest events</div>
        <div class="text-base text-neutral-600">
          Explore active campaigns and support community-driven efforts that
          make a real difference
        </div>
      </div>

      <LandingCampaignSearchResultList
        v-if="campaigns"
        class="z-10 -mt-2 px-10"
      >
        <template v-if="campaignsInProgress">
          <CampaignCardLoader v-for="(_, index) in Array(5)" :key="index" />
        </template>
        <template v-else>
          <div
            v-for="campaign in campaigns"
            :key="campaign.title"
            class="flex flex-col gap-4 items-center justify-between"
          >
            <CampaignEvent :campaign="campaign" />
            <CampaignCard :campaign="campaign" />
          </div>
        </template>
      </LandingCampaignSearchResultList>

      <div
        id="searchElement"
        class="text-gray-700 w-full flex flex-col items-start md:items-center justify-center gap-2 px-10"
      >
        <div class="text-4xl font-semibold">View all campaigns</div>
        <div class="text-base text-neutral-600">
          Search campaigns by categories to find the one you need
        </div>

        <LandingSearch class="z-20 px-10 pt-4">
          <template #filters>
            <template v-if="filtersInProgress">
              <CommonFiltersLoader />
            </template>
            <template v-else>
              <CommonFiltersSelect
                class="w-full justify-center"
                :filters="filters"
                @update:select-item="onFilterSelect"
              />
            </template>
          </template>
        </LandingSearch>
      </div>

      <LandingCampaignSearchResultList
        v-if="searchedCampaigns"
        class="z-10 -mt-2 px-10"
      >
        <template v-if="searchedCampaignsInProgress">
          <CampaignCardLoader v-for="(_, index) in Array(5)" :key="index" />
        </template>
        <template v-else>
          <CampaignCard
            v-for="campaign in searchedCampaigns"
            :key="campaign.title"
            :campaign="campaign"
          />
        </template>
      </LandingCampaignSearchResultList>
    </div>

    <LandingFooter />
  </div>
</template>

<script setup lang="ts">
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

const campaigns = computed(() => {
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

const campaignsInProgress = computed(() => {
  return (
    latestCreatedCampaignsInProgress.value ||
    latestContributedCampaignsInProgress.value
  );
});
</script>
