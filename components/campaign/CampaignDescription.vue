<template>
  <div class="w-full flex flex-col justify-center items-start gap-5">
    <div class="text-3xl font-semibold">Campaign description</div>
    {{ description }}
  </div>
</template>

<script lang="ts" setup>
const { description } = defineProps<{
  description: string;
}>();
</script>
