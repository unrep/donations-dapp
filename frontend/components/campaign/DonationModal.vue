<template>
  <Transition>
    <div
      v-if="isOpen"
      class="z-50 fixed top-0 left-0 w-screen h-screen flex items-center justify-center"
    >
      <div
        class="z-10 absolute w-full h-full bg-black bg-opacity-20 backdrop-blur-sm"
        @click.stop="closeModal"
      />

      <div
        class="z-20 overflow-hidden p-7 w-11/12 mlg:w-full max-w-3xl absolute shadow-lg rounded-3xl bg-white"
        style="grid-template-columns: 1fr 2fr"
      >
        <div
          v-if="isConnected"
          class="w-full flex flex-col mlg:grid grid-cols-2 items-center justify-center gap-10"
        >
          <div class="self-start space-y-1 mlg:space-y-5">
            <h1
              class="text-4xl font-bold text-indigo-800 text-center mlg:text-left"
            >
              Donate to this campaign
            </h1>

            <p class="text-base text-gray-500 hidden mlg:block">
              Your donation will help this campaign reach its goal.
            </p>
          </div>

          <div
            class="self-start w-full grid grid-cols-3 gap-2 items-center justify-start"
          >
            <p class="text-lg col-span-3 mb-3">
              You can choose a preset amount or enter a custom amount.
            </p>
            <button
              v-for="(price, index) in presetPrices"
              :key="index"
              :class="['button-style', price.selected && 'active']"
              @click="
                () => {
                  showEthInput = false;
                  donateFullAmount = false;
                  togglePresetPrice(index);
                }
              "
            >
              {{ price.priceValue }}$
            </button>
            <button
              :class="['col-span-3 button-style', donateFullAmount && 'active']"
              @click="
                () => {
                  showEthInput = false;
                  togglePresetPrice(null);
                  donateFullAmount = !donateFullAmount;
                }
              "
            >
              Donate a full amount
            </button>
            <button
              :class="['col-span-3 button-style', showEthInput && 'active']"
              @click="
                () => {
                  showEthInput = !showEthInput;
                  donateFullAmount = false;
                  togglePresetPrice(null);
                }
              "
            >
              Custom amount
            </button>

            <Transition name="slide">
              <div v-if="showEthInput" class="w-full col-span-3 mt-5">
                <CommonETHInput
                  :model-value="inputValue"
                  @update:model-value="
                    (newValue) => {
                      inputValue = newValue;
                    }
                  "
                />
              </div>
            </Transition>
          </div>

          <div class="w-full col-span-2 flex justify-between items-center">
            <button
              class="w-min bg-white border text-indigo-800 text-lg font-medium px-8 py-2 rounded-xl hover:scale-105 duration-200 shadow-md"
              @click="closeModal"
            >
              Cancel
            </button>

            <CommonButton
              v-if="campaign.isOpen"
              :disabled="!donateAmount"
              @click="contributeToCampaign()"
            >
              <transition v-bind="TransitionPrimaryButtonText" mode="out-in">
                <span
                  v-if="contributionInProgress"
                  class="flex items-center justify-center px-5"
                >
                  <IconsLoadingDots width="1.5em" height="1.5em" />
                </span>
                <span v-else class="flex items-center justify-center">
                  <span>Donate</span>
                </span>
              </transition>
            </CommonButton>

            <div v-else>
              <span class="text-red-500">This campaign is closed</span>
            </div>
          </div>
        </div>

        <div
          v-else
          class="w-full flex flex-col justify-center items-center gap-5"
        >
          <h1 class="text-4xl font-bold text-indigo-800 text-center">
            Connect your wallet
          </h1>
          <p class="text-gray-700">
            You need to connect your wallet first to be able to donate
          </p>
          <CommonButton @click="openModal">
            <span class="flex items-center justify-center">
              <span>Connect Wallet</span>
            </span>
          </CommonButton>
        </div>
      </div>
    </div>
  </Transition>

  <div
    class="z-9999 fixed bottom-0 right-0 md:-translate-x-1/2 lg:translate-x-0 lg:right-0 xl:right-[5%] w-full md:w-1/2 lg:w-1/3 h-screen pointer-events-none"
  >
    <ClientOnly>
      <Vue3Lottie
        ref="confettiElement"
        :animation-data="Confetti"
        :auto-play="false"
        :loop="1"
        @on-complete="() => confettiElement?.stop()"
      />
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
import { computedAsync } from "@vueuse/core";

import { formatUnits } from "viem";
import type { Campaign, LottieComponent } from "~/types";

import { useContractCampaign } from "~/composables/contract.campaign";
import { useOnboardStore } from "~/stores/onboard";
import Confetti from "~/assets/animations/Confetti.json";
import { useLandingStore } from "~/stores/landing";

const confettiElement = ref<LottieComponent | undefined>();
const { contributeCampaign: contributeCampaignContract } =
  useContractCampaign();

const { isOpen, campaign } = defineProps({
  isOpen: Boolean,
  campaign: {
    type: Object as () => Campaign,
    required: true,
  },
});

const { openModal } = useOnboardStore();
const { isConnected } = storeToRefs(useOnboardStore());

const inputValue = ref<number | null>(null);
const showEthInput = ref(false);
const donateFullAmount = ref(false);

watch([inputValue, showEthInput, donateFullAmount], () => {
  if (inputValue.value || showEthInput.value) donateFullAmount.value = false;
});

const emit = defineEmits<{
  (eventName: "update:isOpen", value: boolean): void;
}>();

const presetPrices = ref<{ priceValue: number; selected: boolean }[]>([
  { priceValue: 5, selected: false },
  { priceValue: 25, selected: false },
  { priceValue: 100, selected: false },
]);

function togglePresetPrice(index: number | null) {
  if (index === null) {
    presetPrices.value.forEach((p) => (p.selected = false));
  } else {
    const isSelected = presetPrices.value[index].selected;
    presetPrices.value.forEach((p) => (p.selected = false));
    presetPrices.value[index].selected = !isSelected;
  }
}

const selectedPrice = computed(
  () => presetPrices.value.find((p) => p.selected)?.priceValue,
);

const donateAmount = computedAsync(async () => {
  let resultAmount = 0;
  if (showEthInput.value) resultAmount = inputValue.value || 0;
  else if (donateFullAmount.value)
    resultAmount = Number(
      formatUnits(campaign.goal - campaign.raised, ETH_TOKEN.decimals),
    );
  else if (selectedPrice.value)
    resultAmount = await convertUsdToEth(selectedPrice.value);
  else resultAmount = 0;
  return resultAmount;
});

const closeModal = () => emit("update:isOpen", false);

const { getContributionEvents } = useLandingStore();

const { execute: contributeToCampaign, inProgress: contributionInProgress } =
  usePromise(
    async () => {
      if (campaign.id === undefined || !donateAmount.value) return;
      const amountToDonate = donateAmount.value;
      await contributeCampaignContract(
        campaign.id,
        decimalToBigNumber(amountToDonate, ETH_TOKEN.decimals),
      );
      emit("update:isOpen", false);
      confettiElement.value?.play();
      getContributionEvents();
    },
    { cache: false },
  );
</script>

<style lang="scss" scoped>
.button-style {
  @apply bg-white text-indigo-800 border text-lg font-medium px-5 py-2 rounded-xl hover:scale-105 duration-200 shadow-md;
  &.active {
    @apply bg-indigo-800 text-white;
  }
}

.slide-enter-active,
.slide-leave-active {
  transition:
    max-height 0.2s ease-in-out,
    opacity 0.2s ease-in-out;
  max-height: 0; /* Initial state */
  opacity: 0.5;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0; /* Start collapsed */
}

.slide-enter-to,
.slide-leave-from {
  max-height: 50px;
  opacity: 1;
}
</style>
