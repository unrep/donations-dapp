import {
  fetchCampaignsArray,
  searchCampaigns,
} from "~/utils/contract/fetchCampaigns";
import { fetchFilters } from "~/utils/contract/fetchFilters";

import { useContractCampaignStore } from "./contract.campaign";

import type { Campaign } from "~/types";

export const useLandingStore = defineStore("landing", () => {
  const { getLastCampaignIndex } = useContractCampaignStore();
  const campaignsToPreview = ref(20);

  const { result: filters, execute: getFilters } = usePromise(fetchFilters);
  const selectedFilters = computed(() =>
    filters.value
      ?.filter((filter) => filter.selected)
      .map((filter) => filter.text),
  );
  const { result: campaignsLength, execute: getCampaignsLength } =
    usePromise(getLastCampaignIndex);

  const { result: previewCampaigns, execute: getPreviewCampaigns } = usePromise(
    async () => {
      await getCampaignsLength();
      if (!campaignsLength.value) return Promise.resolve([]);
      return fetchCampaignsArray(
        campaignsLength.value - campaignsToPreview.value > 0
          ? campaignsLength.value - campaignsToPreview.value
          : 0,
        campaignsLength.value,
      ).then((res) => res.filter((campaign) => campaign.isOpen));
    },
  );

  const searchedCampaigns = ref<Campaign[]>([]);

  async function searchCampaignsByFilters() {
    if (!selectedFilters.value?.length) {
      searchedCampaigns.value = [];
      return;
    }
    searchedCampaigns.value = await searchCampaigns(
      new Date(0),
      new Date(),
      selectedFilters.value,
    ).then((res) => res.filter((campaign) => campaign.isOpen));
  }

  return {
    filters,
    getFilters,
    selectedFilters,

    previewCampaigns,
    campaignsToPreview,
    getPreviewCampaigns,
    searchedCampaigns,

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
