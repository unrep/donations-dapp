<template>
  <!-- <MainPollsGrid :polls="polls" /> -->
  <div class="bga">
    <NavBar />

    <div class="w-full h-[60vh]">
      <div
        class="w-full h-full flex flex-col items-center justify-center gap-8"
      >
        <div class="text-5xl font-black text-indigo-800 text-center">
          A crypto powered fundraising service
        </div>
        <div class="text-3xl font-black text-indigo-800 w-1/3 text-center">
          Join the next wave of fundraising – secure, transparent, and global.
        </div>
        <a
          href="/create-campaign"
          class="text-2xl font-black bg-indigo-800 text-white text-center px-10 py-3 rounded-full duration-200 cursor-pointer hover:scale-105"
        >
          Create your campaign
        </a>
      </div>
    </div>

    <div
      class="w-full bg-white flex flex-col justify-center items-center gap-10"
    >
      <div
        class="text-gray-700 p-10 pb-0 w-full flex flex-col items-center justify-center gap-2"
      >
        <div class="text-4xl font-semibold">Trending Campaigns</div>
        <div class="text-lg">
          Explore active campaigns and support community-driven efforts that
          make a real difference
        </div>
      </div>

      <LandingCardsCarousel />

      <div
        class="text-gray-700 w-full flex flex-col items-center justify-center gap-2"
      >
        <div class="text-4xl font-semibold">Search Campaigns</div>
        <div class="text-lg">
          Search campaigns by name or categories to find the one you need
        </div>
      </div>
      <LandingSearch :filters="filters" />
    </div>
  </div>
</template>

<script setup lang="ts">
const filters = ref([
  { text: "filter one", selected: false },
  { text: "filter two", selected: false },
  { text: "filter three", selected: false },
  { text: "filter four", selected: false },
  { text: "filter five", selected: false },
]);
</script>

<style lang="scss" scoped>
.bga {
  background: radial-gradient(
      circle at 40% 0%,
      rgb(255, 111, 97, 0.25) 1%,
      rgb(0, 0, 0, 0.07) 30%
    ),
    radial-gradient(
      circle at 80% 10%,
      rgb(255, 111, 97, 0.25) 1%,
      rgb(0, 0, 0, 0.07) 30%
    );
}
/* Hide scrollbar for Chrome, Safari and Opera */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.hide-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
