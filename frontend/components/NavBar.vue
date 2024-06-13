<template>
  <div
    ref="navRef"
    class="z-50 sticky top-0 left-0 w-full bg-white/70 backdrop-blur-lg flex items-center justify-center border-b shadow shadow-black/5"
  >
    <!-- Mobile -->
    <div class="w-full p-5 max-w-7xl flex justify-between items-center">
      <NuxtLink
        to="/"
        class="text-4xl font-black text-indigo-800 hidden md:block"
      >
        Raise&Reach
      </NuxtLink>

      <div class="text-4xl font-black text-indigo-800 block md:hidden">R&R</div>

      <div class="items-center gap-5 hidden lg:flex">
        <NuxtLink to="/" class="nav-button">Home</NuxtLink>
        <NuxtLink to="/create-campaign" class="nav-button">
          Start campaign
        </NuxtLink>
        <button
          class="nav-button"
          @click.stop.prevent="scrollToAnchor('#searchElement')"
        >
          Search
        </button>
        <NuxtLink v-if="hasOwnCampaigns" to="/my-campaigns" class="nav-button">
          Your campaigns
        </NuxtLink>
      </div>

      <div class="flex items-center gap-5 lg:hidden">
        <IconsNav
          class="text-indigo-800 z-20"
          width="1.5rem"
          height="1.5rem"
          @click.stop="navbarOpen = !navbarOpen"
        />
      </div>
    </div>
  </div>

  <!-- Mobile -->
  <Transition name="slide-from-right">
    <div
      v-if="navbarOpen"
      ref="mobileNavRef"
      class="z-50 fixed lg:hidden top-0 right-0 w-2/3 h-screen bg-white bg-opacity-50 backdrop-blur-lg flex flex-col items-end justify-start gap-10"
    >
      <div class="flex items-center justify-center p-5">
        <IconsNav
          class="text-indigo-800 z-20"
          width="1.5rem"
          height="1.5rem"
          @click="navbarOpen = !navbarOpen"
        />
      </div>

      <NuxtLink to="/" class="nav-button">Home</NuxtLink>
      <NuxtLink to="/create-campaign" class="nav-button"
        >Start campaign</NuxtLink
      >
      <button class="nav-button" @click="scrollToAnchor('#searchElement')">
        Search
      </button>
      <NuxtLink v-if="hasOwnCampaigns" to="/my-campaigns" class="nav-button">
        Your campaigns
      </NuxtLink>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import {
  useElementSize,
  useWindowScroll,
  onClickOutside,
  computedAsync,
} from "@vueuse/core";

import { useContractCampaignStore } from "~/stores/contract.campaign";
import { useOnboardStore } from "~/stores/onboard";

const navRef = ref<HTMLElement | null>(null);
const { height: headerHeight } = useElementSize(navRef);
const { y: windowScrollTop } = useWindowScroll();

const mobileNavRef = ref<HTMLElement | null>(null);
const navbarOpen = ref(false);
onClickOutside(mobileNavRef, () => {
  if (!mobileNavRef.value) return;
  navbarOpen.value = false;
});

const scrollToAnchor = (anchor: string) => {
  navbarOpen.value = false;
  const element = document.querySelector(anchor);
  if (!element) return;

  const scrollOffset = 40;
  const elementPosition =
    element.getBoundingClientRect().top + windowScrollTop.value;
  window.scrollTo({
    top: elementPosition - (headerHeight.value || 0) - scrollOffset,
    behavior: "smooth",
  });
};

const { isConnected, account } = storeToRefs(useOnboardStore());
const { getCampaignIdsByOrganizer } = useContractCampaignStore();

const hasOwnCampaigns = computedAsync(async () => {
  if (!isConnected || !account.value.address) return false;
  const campaignIds = await getCampaignIdsByOrganizer(account.value.address);
  return !!campaignIds.length;
});
</script>

<style lang="scss" scoped>
.nav-button {
  @apply px-5 py-2 text-indigo-800 text-2xl lg:text-lg font-bold rounded-lg duration-200 cursor-pointer;

  &.router-link-exact-active {
    @apply scale-110;
  }
  &:not(.router-link-exact-active) {
    &:hover {
      @apply scale-105;
    }
  }
}

.slide-from-right {
  &-enter-active,
  &-leave-active {
    @apply transition-transform;
  }

  &-enter-from,
  &-leave-to {
    @apply translate-x-full;
  }

  &-enter-to,
  &-leave-from {
    @apply translate-x-0;
  }
}
</style>
