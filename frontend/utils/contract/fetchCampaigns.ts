import type { Campaign } from "~/types";

import { useContractCampaign } from "~/composables/contract.campaign";
import { getContentByCid } from "~/helpers/IPFS";

async function enrichCampaignData(
  campaigns: {
    id: bigint;
    goal: bigint;
    createdAt: bigint;
    raised: bigint;
    isOpen: boolean;
    ipfsHash: string;
    filters: readonly string[];
  }[],
): Promise<Campaign[]> {
  const res = await Promise.all(
    campaigns.map(async (campaign): Promise<Campaign | null> => {
      try {
        const ipfsData = await getContentByCid(campaign.ipfsHash);

        return {
          ...campaign,
          ...ipfsData,
          id: Number(campaign.id),
          title: ipfsData.campaignName,
          goal: Number(campaign.goal),
          raised: Number(campaign.raised),
        };
      } catch (error) {
        return null;
      }
    }),
  );

  return res.filter((campaign) => campaign) as Campaign[];
}

export async function fetchCampaignsArray(
  startIndex: number,
  endIndex: number,
): Promise<Campaign[]> {
  const { getCampaigns } = useContractCampaign();
  const campaigns = await getCampaigns(startIndex, endIndex);
  if (!campaigns) throw new Error("Campaigns not found");
  return enrichCampaignData(campaigns);
}

export async function fetchIndexedCampaignsArray(
  indexes: number[],
): Promise<Campaign[]> {
  const { getIndexedCampaigns } = useContractCampaign();
  const campaigns = await getIndexedCampaigns(indexes);
  if (!campaigns) throw new Error("Campaigns not found");
  return enrichCampaignData(campaigns);
}

export async function searchCampaigns(
  startDate: Date,
  endDate: Date,
  filters: string[],
): Promise<Campaign[]> {
  const { searchCampaigns } = useContractCampaign();
  const campaigns = await searchCampaigns(
    startDate.getTime(),
    endDate.getTime(),
    filters,
  );
  if (!campaigns) throw new Error("Campaigns not found");

  return enrichCampaignData(campaigns);
}

export async function fetchCampaign(id: number): Promise<Campaign> {
  const { getCampaign } = useContractCampaign();

  const campaign = await getCampaign(id);
  if (!campaign || !campaign.goal)
    throw new Error(`Campaign with id ${id} not found`);

  const ipfsData = await getContentByCid(campaign.ipfsHash);

  return {
    ...campaign,
    ...ipfsData,
    id: campaign.id,
    title: ipfsData.campaignName,
    goal: campaign.goal,
    raised: campaign.raised,
    createdAt: campaign.createdAt,
  };
}
