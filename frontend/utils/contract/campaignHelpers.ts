import type { Address } from "viem";
import type { Campaign, CampaignWEvents } from "~/types";

// export function getCampaignLatestContribution(campaign: Campaign) {
//   return campaign.contributions[campaign.contributions.length - 1];
// }

export function formatCampaignWEvents(
  campaign: Campaign,
  eventType: "created" | "contributed",
  contributions: { contributor: Address; amount: bigint; timestamp: bigint }[],
): CampaignWEvents {
  if (eventType === "contributed" && contributions.length === 0) {
    throw new Error("Contributions array is empty");
  }
  return {
    ...campaign,
    eventType,
    eventTime:
      eventType === "created"
        ? bigIntToDate(campaign.createdAt)
        : bigIntToDate(contributions[contributions.length - 1].timestamp),
  };
}

export function prettifyCampaign(
  id: bigint,
  campaign: readonly [
    Address,
    bigint,
    bigint,
    bigint,
    string,
    boolean,
    readonly string[],
    boolean,
  ],
) {
  return {
    id,
    organizer: campaign[0],
    goal: campaign[1],
    createdAt: campaign[2],
    raised: campaign[3],
    ipfsHash: campaign[4],
    isOpen: campaign[5],
    filters: campaign[6] as string[],
    isWithdrawn: campaign[7],
  };
}

export function prettifyCampaignArray(
  campaigns: readonly [
    readonly {
      id: bigint;
      organizer: `0x${string}`;
      createdAt: bigint;
      goalAmount: bigint;
      raisedAmount: bigint;
      isOpen: boolean;
      ipfsHash: string;
      isWithdrawn: boolean;
    }[],
    readonly (readonly string[])[],
  ],
) {
  const campaignsData = campaigns[0];
  const campaignsFilters = campaigns[1];

  return campaignsData.map((campaign, index) => ({
    id: campaign.id,
    organizer: campaign.organizer,
    goal: campaign.goalAmount,
    createdAt: campaign.createdAt,
    raised: campaign.raisedAmount,
    isOpen: campaign.isOpen,
    ipfsHash: campaign.ipfsHash,
    filters: campaignsFilters[index],
    isWithdrawn: campaign.isWithdrawn,
  }));
}
