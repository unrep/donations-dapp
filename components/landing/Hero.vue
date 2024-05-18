<template>
  <div class="bouncing-blobs-container">
    <div class="bouncing-blobs-glass"></div>
    <div class="bouncing-blobs">
      <div class="bouncing-blob bouncing-blob--pink"></div>
      <div class="bouncing-blob bouncing-blob--pink"></div>
      <div class="bouncing-blob bouncing-blob--white"></div>
      <div class="bouncing-blob bouncing-blob--pink"></div>
      <div class="bouncing-blob bouncing-blob--purple"></div>
      <div class="bouncing-blob bouncing-blob--purple"></div>
      <div class="bouncing-blob bouncing-blob--pink"></div>
    </div>
  </div>

  <div class="w-full h-[50vh] md:h-[60vh]">
    <div class="w-full h-full flex flex-col items-center justify-center gap-8">
      <div class="text-4xl md:text-5xl font-black text-indigo-800 text-center">
        A crypto powered fundraising service
      </div>
      <div
        class="text-xl md:text-2xl lg:text-3xl font-medium text-indigo-800 lg:w-1/2 text-center"
      >
        Join the next wave of fundraising – secure, transparent, and global.
      </div>
      <NuxtLink
        to="/create-campaign"
        class="text-xl md:text-2xl font-medium bg-indigo-800 text-white text-center px-16 py-4 rounded-full duration-200 cursor-pointer hover:scale-105"
      >
        Create your campaign
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { initBlobs } from "~/helpers/useBlobAnimation";

onMounted(initBlobs);
</script>
