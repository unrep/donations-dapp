<template>
  <div class="flex items-center justify-center gap-1 rounded-full">
    <CommonAddressAvatar />
    <span>{{ shortenFunction(props.address) }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  address: {
    type: String,
    required: true,
  },
  size: {
    type: String as PropType<"xs" | "default">,
    default: "default",
  },
});

const shortenFunction =
  props.size === "xs" ? shortenAddressWithout0x : shortenAddress;
</script>
