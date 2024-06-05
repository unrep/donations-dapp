import { useContractCampaignStore } from "~/stores/contract.campaign";

import { useWeb3Storage } from "./IPFS";

import type { Campaign } from "~/types";

export async function fetchCampaigns(startIndex: number, endIndex: number) {
  const { getCampaigns } = useContractCampaignStore();

  const campaigns = await getCampaigns(startIndex, endIndex);

  const { getContentByCid } = useWeb3Storage();

  return Promise.all(
    campaigns.map(async (campaign): Promise<Campaign> => {
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

export async function fetchCampaign(id: number) {
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
  };
}
