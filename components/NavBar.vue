<template>
  <div
    ref="navRef"
    class="z-50 sticky top-0 left-0 w-full bg-opacity-50 backdrop-blur-lg flex items-center justify-center border-b nav-shadow"
  >
    <div class="w-full p-5 max-w-7xl flex justify-between items-center">
      <div class="text-4xl font-black text-indigo-600 hidden md:block">
        Raise&Reach
      </div>
      <div class="text-4xl font-black text-indigo-600 block md:hidden">R&R</div>

      <div class="items-center gap-5 hidden lg:flex">
        <NuxtLink
          to="/"
          :class="['nav-button', currentPath === '/' && 'active']"
          >Home</NuxtLink
        >
        <NuxtLink
          to="/create-campaign"
          :class="[
            'nav-button',
            currentPath === '/create-campaign' && 'active',
          ]"
        >
          Start campaign
        </NuxtLink>
        <NuxtLink class="nav-button" @click="scrollToAnchor('#scrollhere')">
          Search
        </NuxtLink>
      </div>

      <div class="flex items-center gap-5 lg:hidden">
        <IconsNav
          class="text-indigo-600 z-20"
          width="1.5rem"
          height="1.5rem"
          @click.stop="navbarOpen = !navbarOpen"
        />
      </div>
    </div>
  </div>

  <Transition name="slide-from-right">
    <div
      v-if="navbarOpen"
      ref="mobileNavRef"
      class="z-50 fixed top-0 right-0 w-2/3 h-screen bg-white bg-opacity-50 backdrop-blur-lg flex flex-col items-end justify-start gap-10"
    >
      <div
        class="flex items-center justify-center p-5"
        :style="`height: ${navRef?.clientHeight || 0}px`"
      >
        <IconsNav
          class="text-indigo-600 z-20"
          width="1.5rem"
          height="1.5rem"
          @click="navbarOpen = !navbarOpen"
        />
      </div>

      <NuxtLink to="/" class="nav-button" @click="scrollToAnchor('#scrollhere')"
        >Home</NuxtLink
      >
      <NuxtLink
        to="/create-campaign"
        class="nav-button"
        @click="scrollToAnchor('#scrollhere')"
        >Start campaign</NuxtLink
      >
      <NuxtLink class="nav-button" @click="scrollToAnchor('#scrollhere')"
        >Search</NuxtLink
      >
    </div>
  </Transition>
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp();

const navRef = ref<HTMLElement | null>(null);

// Set custom anchor with Y axis scrolling to dynamic offset
nuxtApp.$anchorScroll!.defaults.toAnchor = () => ({
  behavior: "smooth",
  offsetTop: -(navRef.value?.clientHeight || 0) - 40,
});

const { scrollToAnchor } = useAnchorScroll();

const { path: currentPath } = useRoute();

const navbarOpen = ref(false);

const mobileNavRef = ref<HTMLElement | null>(null);

const handleClickOutside = (event: MouseEvent) => {
  mobileNavRef.value &&
    !mobileNavRef.value.contains(event.target as Node) &&
    (navbarOpen.value = false);
};

watch(navbarOpen, (opened) => {
  if (opened) {
    document.addEventListener("click", handleClickOutside);
  } else {
    document.removeEventListener("click", handleClickOutside);
  }
});
</script>

<style>
.nav-shadow {
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
}

.nav-button {
  @apply px-5 py-2 text-indigo-600 text-2xl lg:text-lg font-bold rounded-lg duration-200 cursor-pointer;

  &.active {
    @apply scale-110;
  }

  &:hover {
    @apply scale-105;
  }
}

.slide-from-right {
  &-enter-active,
  &-leave-active {
    transition: transform 0.3s;
  }

  &-enter-from,
  &-leave-to {
    transform: translateX(100%);
  }

  &-enter-to,
  &-leave-from {
    transform: translateX(0);
  }
}
</style>
