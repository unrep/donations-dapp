<script setup lang="ts">
import { useWeb3Modal } from "@web3modal/wagmi/vue";

import { useWagmi } from "~/stores/wagmi";
useWagmi();
const modal = useWeb3Modal();
</script>

<template>
  <button @click="modal.open()">Open Connect Modal</button>
  <button @click="modal.open({ view: 'Networks' })">Open Network Modal</button>
</template>
