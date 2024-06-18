<template>
  <button
    class="rounded-full py-1 pl-2 pr-3 border bg-gray-100 font-semibold text-gray-500"
    @click="openModal"
  >
    <div
      v-if="isConnected && account.address"
      class="flex items-center justify-center gap-1"
    >
      <CommonAddressAvatar />
      <span>{{ shortenAddress(account.address) }}</span>
    </div>
    <span v-else-if="isConnectingWallet">
      <IconsLoadingDots />
      Connecting
    </span>
    <span v-else class="px-1">Connect wallet</span>
  </button>
</template>

<script lang="ts" setup>
import { useOnboardStore } from "~/stores/onboard";

const { account, isConnected, isConnectingWallet } =
  storeToRefs(useOnboardStore());
const { openModal } = useOnboardStore();
</script>
