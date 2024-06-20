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
        'flex-grow flex flex-col items-center justify-center gap-5 ',
        preview ? 'xl:gap-10' : 'md:gap-10',
      ]"
    >
      <div
        :class="[
          'w-full text-3xl font-bold text-indigo-800',
          preview ? 'xl:text-4xl 3xl:text-5xl' : 'md:text-4xl xl:text-5xl',
        ]"
      >
        {{ campaign.title }}
      </div>

      <img
        class="rounded-3xl w-full h-full aspect-video object-cover object-center relative"
        :src="campaign.image"
        alt="campaign"
      />
    </div>

    <div
      :class="[
        'h-full w-full shadow-md bg-opacity-40 backdrop-blur-sm bg-white rounded-3xl py-5 px-5 gap-3 flex flex-col justify-between items-center',
        preview ? '2xl:items-start' : 'lg:items-start',
      ]"
    >
      <div class="text-xl">
        Started at
        {{
          campaign?.createdAt
            ? formatDate(campaign?.createdAt, "Do MMM YYYY")
            : ""
        }}
      </div>

      <div class="w-full">
        <button
          class="overflow-hidden"
          @click="() => (showCurrency = showCurrency === 'eth' ? 'usd' : 'eth')"
        >
          <Transition v-bind="TransitionPrimaryButtonText" mode="out-in">
            <div :key="showCurrency" class="w-full text-2xl font-semibold px-1">
              {{
                showCurrency === "usd"
                  ? raisedUSD
                  : `${Math.floor(+campaign.raised * 100) / 100}ETH`
              }}
              <span class="font-normal text-base"
                >raised of
                {{
                  showCurrency === "usd" ? goalUSD : `${campaign.goal}ETH`
                }}</span
              >
            </div>
          </Transition>
        </button>

        <div class="w-full text-center">
          <div class="w-full rounded-full overflow-hidden h-3 bg-gray-300">
            <div
              class="raised-percentage-width h-full bg-indigo-800 rounded-full"
              :style="{ '--raised-percentage': `${raisedPercentage}%` }"
            />
          </div>
        </div>
      </div>

      <div class="flex-grow h-full w-full flex flex-col justify-end gap-2 p-2">
        <div
          class="w-full max-h-72 sm:max-h-40 lg:max-h-72 flex flex-row-reverse flex-wrap-reverse items-start justify-end gap-2 overflow-y-auto"
        >
          <TransitionGroup
            v-bind="TransitionPrimaryButtonTextReverse"
            mode="out-in"
          >
            <div
              v-for="donation in campaign.contributions
                .slice()
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())"
              :key="donation.contributor + donation.timestamp.getTime()"
              class="w-max h-max text-center px-3 py-1 text-sm rounded-lg bg-opacity-50 duration-200 flex gap-1 items-center"
            >
              <CommonAccountView :address="donation.contributor" size="xs" />
              <span>
                donated
                <b>{{ floorEthAmount(donation.amount) }} ETH</b>
                {{ formatDateAgo(donation.timestamp) }}
              </span>
            </div>
          </TransitionGroup>
        </div>
        <span class="text-lg text-center w-full"
          >{{ donationsCount }} donations in total</span
        >
      </div>

      <button
        v-if="campaign.isOpen"
        to="/create-campaign"
        :class="[
          'self-end w-full text-2xl font-bold bg-indigo-800 text-white text-center px-10 py-3 rounded-2xl duration-200 cursor-pointer hover:scale-105',
          preview ? 'xl:w-max 2xl:w-full' : 'md:w-max lg:w-full',
        ]"
        :disabled="preview"
        @click="modalOpened = !modalOpened"
      >
        Donate
      </button>

      <div
        v-else
        class="w-full text-center text-indigo-500 text-xl md:text-2xl font-bold"
      >
        This campaign has ended
      </div>
    </div>

    <div class="w-full flex flex-col justify-center items-start gap-5">
      <div class="text-3xl font-semibold">Campaign description</div>
      <CommonRichViewer :content="campaign.description" />
    </div>
  </div>

  <CampaignDonationModal
    :is-open="modalOpened"
    :campaign="campaign"
    @update:is-open="(value) => (modalOpened = value)"
    @refresh:campaign="emit('refresh:campaign')"
  />
</template>

<script setup lang="ts">
import { formatDate } from "@vueuse/core";

import { type Campaign } from "~/types";

const showCurrency = ref<"eth" | "usd">("usd");

const modalOpened = ref(false);

const { campaign } = defineProps({
  campaign: {
    type: Object as () => Campaign,
    required: true,
  },
  preview: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits<{
  (eventName: "refresh:campaign"): void;
}>();

const { result: goalUSD, execute: getGoalUSD } = usePromise(() =>
  computeETHPrice(campaign.goal),
);
const { result: raisedUSD, execute: getRaisedUSD } = usePromise(() =>
  computeETHPrice(campaign.raised),
);

const raisedPercentage = computed(() =>
  Math.floor((+campaign.raised / +campaign.goal) * 100),
);

const donationsCount = computed(() => campaign.contributions?.length);

onMounted(async () => {
  await getGoalUSD();
  await getRaisedUSD();
});
</script>

<style lang="scss">
.raised-percentage-width {
  width: var(--raised-percentage);
}
</style>
