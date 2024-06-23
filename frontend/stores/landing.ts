import { computedAsync } from "@vueuse/core";
import { useContractCampaignStore } from "./contract.campaign";

import {
  fetchCampaignsArray,
  fetchIndexedCampaignsArray,
  searchCampaigns,
} from "~/utils/contract/fetchCampaigns";
import { fetchFilters } from "~/utils/contract/fetchFilters";

export const useLandingStore = defineStore("landing", () => {
  const {
    getLastCampaignIndex,
    getCreationEvents,
    getContributionEvents: getContributionEventsFromContract,
  } = useContractCampaignStore();
  const campaignsToPreview = ref(20);

  const {
    result: filters,
    reload: getFilters,
    inProgress: filtersInProgress,
  } = usePromise(fetchFilters);
  const selectedFilters = computed(() =>
    filters.value
      ?.filter((filter) => filter.selected)
      .map((filter) => filter.text),
  );
  const { result: campaignsLength, reload: getCampaignsLength } =
    usePromise(getLastCampaignIndex);

  const {
    result: previewCampaigns,
    reload: getPreviewCampaigns,
    inProgress: previewCampaignsInProgress,
  } = usePromise(async () => {
    await getCampaignsLength();
    if (!campaignsLength.value) return Promise.resolve([]);
    return fetchCampaignsArray(
      campaignsLength.value - campaignsToPreview.value > 0
        ? campaignsLength.value - campaignsToPreview.value
        : 0,
      campaignsLength.value,
    ).then((res) => res.filter((campaign) => campaign.isOpen));
  });

  const {
    result: searchedCampaigns,
    reload: searchCampaignsByFilters,
    inProgress: searchedCampaignsInProgress,
  } = usePromise(() => {
    if (!selectedFilters.value?.length) {
      return Promise.resolve([]);
    }
    return searchCampaigns(new Date(0), new Date(), selectedFilters.value).then(
      (res) => res.filter((campaign) => campaign.isOpen),
    );
  });

  const {
    result: latestCreatedCampaigns,
    reload: getLatestCreatedCampaigns,
    inProgress: latestCreatedCampaignsInProgress,
  } = usePromise(async () => {
    const campaignIds = await getCreationEvents().then((res) =>
      res.map((event) => Number(event.campaignId)),
    );
    return fetchIndexedCampaignsArray(campaignIds).then((res) =>
      res.filter((campaign) => campaign.isOpen),
    );
  });

  const latestContributedCampaignsInProgress = ref(false);

  const latestContributedCampaigns = computedAsync(() => {
    latestContributedCampaignsInProgress.value = true;
    const campaignIds = contributionEvents.value?.reduce((acc, event) => {
      event.campaignId && acc.push(Number(event.campaignId));
      return acc;
    }, [] as number[]);

    if (!campaignIds) return [];
    return fetchIndexedCampaignsArray(campaignIds)
      .then((res) => res.filter((campaign) => campaign.isOpen))
      .finally(() => {
        latestContributedCampaignsInProgress.value = false;
      });
  });

  const { result: contributionEvents, execute: getContributionEvents } =
    usePromise(getContributionEventsFromContract);

  return {
    filters,
    getFilters,
    selectedFilters,
    filtersInProgress,

    previewCampaigns,
    previewCampaignsInProgress,
    campaignsToPreview,
    getPreviewCampaigns,
    searchedCampaigns,
    searchedCampaignsInProgress,
    latestCreatedCampaigns,
    getLatestCreatedCampaigns,
    latestCreatedCampaignsInProgress,
    latestContributedCampaigns,
    latestContributedCampaignsInProgress,
    contributionEvents,
    getContributionEvents,

    onFilterSelect: ({
      filterIndex,
      selected,
    }: {
      filterIndex: number;
      selected: boolean;
    }) => {
      filters.value && (filters.value[filterIndex].selected = selected);
      searchCampaignsByFilters();
    },
  };
});
