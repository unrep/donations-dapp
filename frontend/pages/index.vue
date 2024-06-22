<template>
  <div>
    <NavBar />
    <LandingHero />

    <div
      class="w-full bg-white flex flex-col justify-center items-center gap-10 pb-10"
    >
      <div
        class="text-gray-700 p-10 pb-0 w-full flex flex-col items-start md:items-center justify-center gap-2"
      >
        <div class="text-4xl font-semibold">Latest events</div>
        <div class="text-lg">
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
            class="flex flex-col gap-2 items-center justify-between"
          >
            <div
              v-if="campaign.createdAt && campaign.eventType === 'created'"
              class="flex-grow flex items-center justify-center gap-2"
            >
              <CommonAccountView :address="campaign.organizer" />
              <div class="text-sm">created campaign</div>
              {{ formatDateAgo(campaign.createdAt) }}
            </div>
            <div
              v-else-if="campaign.eventType === 'contributed'"
              class="flex-grow flex flex-col justify-center items-center gap-0"
            >
              <div class="flex items-center gap-2">
                <CommonAccountView
                  :address="getCampaignLatestContribution(campaign).contributor"
                />
                <div class="text-sm">contributed to campaign</div>
              </div>
              <div>
                {{
                  computeETHPriceBigint(
                    getCampaignLatestContribution(campaign).amount,
                  )
                }}
                {{
                  formatDateAgo(
                    getCampaignLatestContribution(campaign).timestamp,
                  )
                }}
              </div>
            </div>
            <CampaignCard :campaign="campaign" />
          </div>
        </template>
      </LandingCampaignSearchResultList>

      <div
        id="searchElement"
        class="text-gray-700 w-full flex flex-col items-start md:items-center justify-center gap-2 px-10"
      >
        <div class="text-4xl font-semibold">Search Campaigns</div>
        <div class="text-lg">
          Search campaigns by name or categories to find the one you need
        </div>
      </div>

      <LandingSearch class="z-20 px-10">
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
} = storeToRefs(useLandingStore());
const {
  onFilterSelect,
  getFilters,
  getPreviewCampaigns,
  getLatestCreatedCampaigns,
  getLatestContributedCampaigns,
} = useLandingStore();

onMounted(() => {
  getPreviewCampaigns();
  getFilters();
  getLatestCreatedCampaigns();
  getLatestContributedCampaigns();
});

const campaigns = computed(() => {
  const createdCamapaigns =
    latestCreatedCampaigns.value?.map((campaign) =>
      formatCampaignWEvents(campaign, "created"),
    ) || [];

  const contributedCamapaigns =
    latestContributedCampaigns.value?.map((campaign) =>
      formatCampaignWEvents(campaign, "contributed"),
    ) || [];

  const mergedCampaigns: CampaignWEvents[] = [
    ...createdCamapaigns,
    ...contributedCamapaigns,
  ];

  // Reduce the merged array to only unique campaigns based on campaignId, taking the latest
  return Object.values(
    mergedCampaigns.reduce(
      (acc: { [key: string]: CampaignWEvents }, campaign: CampaignWEvents) => {
        const campaignKey = campaign.id;
        if (acc[campaignKey]) {
          if (
            new Date(acc[campaignKey].eventTime) < new Date(campaign.eventTime)
          ) {
            acc[campaignKey] = campaign;
          }
        } else {
          acc[campaignKey] = campaign;
        }
        return acc;
      },
      {},
    ),
  ).sort(
    (a, b) => new Date(b.eventTime).getTime() - new Date(a.eventTime).getTime(),
  );
});
const campaignsInProgress = computed(
  () =>
    latestContributedCampaignsInProgress.value &&
    latestCreatedCampaignsInProgress.value,
);
</script>
