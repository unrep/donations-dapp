import { useContractCampaignStore } from "~/stores/contract.campaign";

export function fetchFilters() {
  const { getCampaignFilters } = useContractCampaignStore();

  return getCampaignFilters().then((res) =>
    res.map((filter) => ({
      text: filter.replace(/_/g, " "),
      selected: false,
    })),
  );
}
