import type { Address } from "viem";
import type { Campaign, CampaignWEvents } from "~/types";

export function getCampaignLatestContribution(campaign: Campaign) {
  return campaign.contributions[campaign.contributions.length - 1];
}

export function formatCampaignWEvents(
  campaign: Campaign,
  eventType: "created" | "contributed",
): CampaignWEvents {
  return {
    ...campaign,
    eventType,
    eventTime:
      eventType === "created"
        ? campaign.createdAt
        : getCampaignLatestContribution(campaign).timestamp,
  };
}

export function prettifyCampaign(
  id: number,
  campaign: readonly [
    Address,
    bigint,
    bigint,
    bigint,
    string,
    boolean,
    readonly string[],
    readonly {
      contributor: Address;
      amount: bigint;
      timestamp: bigint;
    }[],
    boolean,
  ],
) {
  return {
    id,
    goalAmount: weiToNumber(campaign[1]),
    createdAt: bigIntToDate(campaign[2]),
    raisedAmount: weiToNumber(campaign[3]),
    ipfsHash: campaign[4],
    isOpen: campaign[5],
    filters: campaign[6],
    contributions: campaign[7].map((contribution) => ({
      ...contribution,
      timestamp: new Date(bigIntToDate(contribution.timestamp)),
    })),
    isWithdrawn: campaign[8],
    organizer: campaign[0],
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
      contributions?: readonly {
        contributor: `0x${string}`;
        amount: bigint;
        timestamp: bigint;
      }[];
    }[],
    readonly (readonly string[])[],
  ],
) {
  const campaignsData = campaigns[0];
  const campaignsFilters = campaigns[1];

  return campaignsData.map((campaign, index) => ({
    id: Number(campaign.id),
    organizer: campaign.organizer,
    goalAmount: weiToNumber(campaign.goalAmount),
    createdAt: bigIntToDate(campaign.createdAt),
    raisedAmount: weiToNumber(campaign.raisedAmount),
    isOpen: campaign.isOpen,
    ipfsHash: campaign.ipfsHash,
    filters: campaignsFilters[index],
    contributions:
      campaign.contributions?.map((contribution) => ({
        ...contribution,
        timestamp: bigIntToDate(contribution.timestamp),
      })) || [],
    isWithdrawn: campaign.isWithdrawn,
  }));
}
