import { useContractCampaignStore } from "~/stores/contract.campaign";

import { useWeb3Storage } from "./IPFS";

import type { Campaign } from "~/types";

function enrichCampaignData(
  campaigns: {
    id: number;
    goalAmount: number;
    createdAt: number;
    raisedAmount: number;
    isOpen: boolean;
    ipfsHash: string;
    filters: readonly string[];
    contributions: never[];
  }[],
) {
  const { getContentByCid } = useWeb3Storage();

  return Promise.all(
    campaigns.map(async (campaign) => {
      const ipfsData = await getContentByCid(campaign.ipfsHash);

      return {
        ...campaign,
        ...ipfsData,
        id: Number(campaign.id),
        title: ipfsData.campaignName,
        goal: Number(campaign.goalAmount),
        raised: Number(campaign.raisedAmount),
      };
    }),
  );
}

export async function fetchCampaignsArray(
  startIndex: number,
  endIndex: number,
): Promise<Campaign[]> {
  const { getCampaigns } = useContractCampaignStore();
  const campaigns = await getCampaigns(startIndex, endIndex);
  return enrichCampaignData(campaigns);
}

export async function searchCampaigns(
  startDate: Date,
  endDate: Date,
  filters: string[],
): Promise<Campaign[]> {
  const { searchCampaigns } = useContractCampaignStore();
  const campaigns = await searchCampaigns(
    startDate.getTime(),
    endDate.getTime(),
    filters,
  );
  return enrichCampaignData(campaigns);
}

export async function fetchCampaign(id: number): Promise<Campaign> {
  const { getCampaign } = useContractCampaignStore();

  const campaign = await getCampaign(id);

  const { getContentByCid } = useWeb3Storage();

  const ipfsData = await getContentByCid(campaign.ipfsHash);

  return {
    ...campaign,
    ...ipfsData,
    id: Number(campaign.id),
    title: ipfsData.campaignName,
    goal: Number(campaign.goalAmount),
    raised: Number(campaign.raisedAmount),
    createdAt: new Date(Number(campaign.createdAt)),
  };
}
