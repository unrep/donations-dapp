import { useContractCampaign } from "~/composables/contract.campaign";

export function fetchFilters() {
  const { getCampaignFilters } = useContractCampaign();

  return getCampaignFilters().then((res) =>
    res.map((filter) => ({
      text: filter.replace(/_/g, " "),
      selected: false,
    })),
  );
}
