<template>
  <div>
    <CommonLatestContributionsSlider />
    <NavBar />
    <LandingHero />

    <div
      class="w-full bg-white flex flex-col justify-center items-center gap-10 pb-10"
    >
      <div
        class="text-gray-700 p-10 pb-0 w-full flex flex-col items-start md:items-center justify-center gap-2"
      >
        <div class="text-4xl font-semibold">Trending Campaigns</div>
        <div class="text-lg">
          Explore active campaigns and support community-driven efforts that
          make a real difference
        </div>
      </div>

      <LandingCardsCarousel v-if="previewCampaigns?.length">
        <template v-if="previewCampaignsInProgress">
          <CampaignCardLoader v-for="(_, index) in Array(5)" :key="index" />
        </template>
        <template v-else>
          <CampaignCard
            v-for="campaign in previewCampaigns"
            :key="campaign.id"
            :campaign="campaign"
          />
        </template>
      </LandingCardsCarousel>

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

const {
  previewCampaigns,
  searchedCampaigns,
  previewCampaignsInProgress,
  searchedCampaignsInProgress,
  filters,
  filtersInProgress,
} = storeToRefs(useLandingStore());
const { onFilterSelect, getFilters, getPreviewCampaigns } = useLandingStore();

onMounted(() => {
  getPreviewCampaigns();
  getFilters();
});
</script>
