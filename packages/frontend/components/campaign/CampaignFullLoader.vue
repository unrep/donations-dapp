<template>
  <div
    :class="[
      'w-full max-w-7xl p-5 flex flex-col grid-cols-2 flex-nowrap gap-5 justify-items-stretch',
      preview ? '2xl:grid xl:p-10 xl:gap-10' : 'lg:grid md:p-10 md:gap-10',
    ]"
    style="grid-template-columns: 7fr 3fr"
  >
    <div
      :class="[
        'flex-grow flex flex-col items-center justify-center gap-5',
        preview ? 'xl:gap-10' : 'md:gap-10',
      ]"
    >
      <div class="w-full flex justify-start gap-2">
        <div class="rounded-full bg-gray-200 animate-pulse w-32 h-8" />
        <div class="rounded-full bg-gray-200 animate-pulse w-52 h-8" />
        <div class="rounded-full bg-gray-200 animate-pulse w-40 h-8" />
      </div>

      <div class="w-full bg-gray-200 animate-pulse h-96 rounded-3xl"></div>
    </div>

    <div
      :class="[
        'h-full w-full bg-gray-200 animate-pulse rounded-3xl py-5 px-5 gap-10 flex flex-col justify-center items-center',
        preview ? '2xl:items-start' : 'lg:items-start',
      ]"
    >
      <div
        class="gap-5 w-full h-full flex flex-col items-start justify-start px-2 pt-2"
      >
        <div class="rounded-full bg-gray-300 animate-pulse w-3/4 h-6" />
        <div class="rounded-full bg-gray-300 animate-pulse w-full h-4" />
        <div class="rounded-full bg-gray-300 animate-pulse w-5/6 h-6" />
      </div>

      <div class="rounded-full bg-gray-300 animate-pulse w-full h-16" />
    </div>

    <div class="w-full flex flex-col justify-center items-start gap-5">
      <div class="w-full flex flex-wrap gap-2">
        <div class="rounded-full bg-gray-200 animate-pulse w-32 h-6" />
        <div class="rounded-full bg-gray-200 animate-pulse w-48 h-6" />
      </div>

      <div class="w-full flex flex-wrap gap-2">
        <div class="rounded-full bg-gray-200 animate-pulse w-20 h-4" />
        <div class="rounded-full bg-gray-200 animate-pulse w-32 h-4" />
        <div class="rounded-full bg-gray-200 animate-pulse w-24 h-4" />
        <div class="rounded-full bg-gray-200 animate-pulse w-32 h-4" />
        <div class="rounded-full bg-gray-200 animate-pulse w-28 h-4" />
        <div class="rounded-full bg-gray-200 animate-pulse w-48 h-4" />
        <div class="rounded-full bg-gray-200 animate-pulse w-36 h-4" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  preview: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>
