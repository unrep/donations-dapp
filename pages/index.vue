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
        <div class="text-4xl font-semibold">Trending Campaigns</div>
        <div class="text-lg">
          Explore active campaigns and support community-driven efforts that
          make a real difference
        </div>
      </div>

      <LandingCardsCarousel
        v-if="previewCampaigns?.length"
        :campaigns="previewCampaigns"
      />

      <div
        id="searchElement"
        class="text-gray-700 w-full flex flex-col items-start md:items-center justify-center gap-2 px-10"
      >
        <div class="text-4xl font-semibold">Search Campaigns</div>
        <div class="text-lg">
          Search campaigns by name or categories to find the one you need
        </div>
      </div>

      <LandingSearch class="z-20 px-10" />

      <LandingCampaignSearchResultList
        v-if="searchedCampaigns"
        class="z-10 -mt-2 px-10"
        :campaigns="searchedCampaigns"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLandingStore } from "~/stores/landing";

const { previewCampaigns, searchedCampaigns } = storeToRefs(useLandingStore());

onMounted(() => {
  useLandingStore().getPreviewCampaigns();
});
</script>
