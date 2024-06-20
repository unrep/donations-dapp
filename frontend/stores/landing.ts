import { useContractCampaignStore } from "./contract.campaign";

import {
  fetchCampaignsArray,
  searchCampaigns,
} from "~/utils/contract/fetchCampaigns";
import { fetchFilters } from "~/utils/contract/fetchFilters";

export const useLandingStore = defineStore("landing", () => {
  const { getLastCampaignIndex } = useContractCampaignStore();
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
