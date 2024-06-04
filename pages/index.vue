<template>
  <div>
    <NavBar />
    <LandingHero />

    <button @click="openModal">open MOdal</button>

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

      <LandingCardsCarousel v-if="campaigns" :campaigns="campaigns" />

      <div
        id="searchElement"
        class="text-gray-700 w-full flex flex-col items-start md:items-center justify-center gap-2 px-10"
      >
        <div class="text-4xl font-semibold">Search Campaigns</div>
        <div class="text-lg">
          Search campaigns by name or categories to find the one you need
        </div>
      </div>

      <LandingSearch class="z-20 px-10" :filters="filters" />

      <LandingCampaignSearchResultList
        v-if="searchedCampaigns"
        class="z-10 -mt-2 px-10"
        :campaigns="searchedCampaigns"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOnboardStore } from "~/stores/onboard";

import type { Campaign } from "~/types";

const { openModal } = useOnboardStore();

const filters = ref<{ text: string; selected: boolean }[]>([]);
const campaigns = ref<Campaign[] | null>(null);
const searchedCampaigns = ref<Campaign[] | null>(null);
</script>
