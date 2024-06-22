import { useWeb3Storage } from "../../helpers/IPFS";

import type { Campaign } from "~/types";

import { useContractCampaignStore } from "~/stores/contract.campaign";

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
  if (!campaigns) throw new Error("Campaigns not found");
  return enrichCampaignData(campaigns);
}

export async function fetchIndexedCampaignsArray(
  indexes: number[],
): Promise<Campaign[]> {
  const { getIndexedCampaigns } = useContractCampaignStore();
  const campaigns = await getIndexedCampaigns(indexes);
  if (!campaigns) throw new Error("Campaigns not found");
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
  if (!campaigns) throw new Error("Campaigns not found");

  return enrichCampaignData(campaigns);
}

export async function fetchCampaign(id: number): Promise<Campaign> {
  const { getCampaign } = useContractCampaignStore();

  const campaign = await getCampaign(id);
  if (!campaign || !campaign.goalAmount)
    throw new Error(`Campaign with id ${id} not found`);

  const { getContentByCid } = useWeb3Storage();

  const ipfsData = await getContentByCid(campaign.ipfsHash);

  return {
    ...campaign,
    ...ipfsData,
    id: campaign.id,
    title: ipfsData.campaignName,
    goal: campaign.goalAmount,
    raised: campaign.raisedAmount,
    createdAt: new Date(campaign.createdAt),
  };
}
