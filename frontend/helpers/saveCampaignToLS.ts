import type { Campaign } from "~/types";

export function saveCampaignToLS(campaign: Campaign) {
  const campaignToSave = {
    ...campaign,
    id: campaign.id.toString(),
    createdAt: campaign.createdAt.toString(),
    goal: campaign.goal.toString(),
    raised: campaign.raised.toString(),
  };
  localStorage.setItem("campaign", JSON.stringify(campaignToSave));
}

export function getCampaignFromLS(): Campaign | null {
  const lsCampaign = localStorage.getItem("campaign");
  if (!lsCampaign) return null;
  const campaign = JSON.parse(lsCampaign);
  return {
    ...campaign,
    id: BigInt(campaign.id),
    createdAt: BigInt(campaign.createdAt),
    goal: BigInt(campaign.goal),
    raised: BigInt(campaign.raised),
  };
}
