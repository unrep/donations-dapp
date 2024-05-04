<template>
  <h1 class="error-status-code">{{ error.statusCode }}</h1>
  <p class="error-message">{{ error.message }}</p>
  <NuxtLink to="/" class="mt-4"> Back </NuxtLink>
</template>

<script lang="ts">
import { type PropType } from "vue";

export default {
  props: {
    error: {
      type: Object as PropType<any>,
      required: true,
    },
  },
};
</script>
