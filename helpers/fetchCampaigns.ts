import { useContractCampaignStore } from "~/stores/contract.campaign";

import { useWeb3Storage } from "./IPFS";

export async function fetchCampaigns(startIndex: number, endIndex: number) {
  const { getCampaigns } = useContractCampaignStore();

  const campaigns = await getCampaigns(startIndex, endIndex);

  const { getContentByCid } = useWeb3Storage();
  const ipfsCampaignsData = await campaigns.forEach((campaign) =>
    getContentByCid(campaign.ipfsHash),
  );
  console.log({ ipfsCampaignsData });
}
