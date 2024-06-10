<template>
  <div
    class="bg-white/70 backdrop-blur-lg w-full overflow-hidden relative py-2 flex gap-16"
  >
    <div
      v-for="(contribution, index) in contributions"
      :key="index"
      class="slide-text whitespace-nowrap text-indigo-800 font-semibold"
      :style="{ animationDuration: `${contributions.length * 3}s` }"
    >
      {{ shortenAddress(contribution.contributor) }} donated
      {{ floorEthAmount(Number(contribution.amount)) }} ETH
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useContractCampaignStore } from "~/stores/contract.campaign";

const { getContributionEvents, watchContributions } =
  useContractCampaignStore();

const contributions = ref<{ contributor: string; amount: bigint }[]>([]);
const MAX_CONTRIBUTION_LENGTH = 20;

getContributionEvents().then((res) =>
  res
    .filter((event) => event.args.contributor && event.args.amount)
    .slice(-MAX_CONTRIBUTION_LENGTH)
    .forEach((contribution) => {
      contributions.value.push({
        contributor: contribution.args.contributor!,
        amount: contribution.args.amount!,
      });
    }),
);

watchContributions((events) => {
  const newContributions = events.map(
    (event: { args: { contributor: any; amount: any } }) => ({
      contributor: event.args.contributor!,
      amount: event.args.amount!,
    }),
  );

  contributions.value.push(newContributions);
  contributions.value = contributions.value.slice(-MAX_CONTRIBUTION_LENGTH);
});
</script>

<style lang="scss">
@keyframes slide {
  from {
    transform: translateX(100vw);
  }
  to {
    transform: translateX(-200vw);
  }
}

.slide-text {
  animation-name: slide;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
</style>
