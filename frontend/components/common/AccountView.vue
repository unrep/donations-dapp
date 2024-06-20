<template>
  <div class="flex items-center justify-center gap-1 rounded-full">
    <CommonAddressAvatar />
    <span>{{ shortenFunction(props.address) }}</span>
  </div>
</template>

<script setup lang="ts">
import { withDefaults } from "vue";

type Props = {
  address: string;
  size: "xs" | "md";
};

const props = withDefaults(defineProps<Props>(), {
  size: "md",
});

const shortenFunction =
  props.size === "xs" ? shortenAddressWithout0x : shortenAddress;
</script>
