<template>
  <input
    type="text"
    class="w-full border border-gray-300 outline-indigo-500 rounded-lg py-1.5 px-3 text-base font-thin"
    :value="value"
  />
</template>

<script setup lang="ts">
defineProps<{
  value: string;
}>();
</script>
