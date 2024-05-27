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
</template>

<script setup lang="ts">
import { initBlobs } from "~/helpers/useBlobAnimation";

// onMounted(initBlobs);
</script>
