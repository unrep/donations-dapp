import { getContract as getContractViem, type Address } from "viem";

import { useOnboardStore } from "./onboard";

export const useContractCampaignStore = defineStore("contact_campaign", () => {
  function getReadContract() {
    const { getPublicClient } = useOnboardStore();

    return getContractViem({
      address: fundraisingContractConfig.address,
      abi: fundraisingContractConfig.abi,
      client: getPublicClient(),
    });
  }
  async function getWriteContract() {
    const { getPublicClient, getWallet } = useOnboardStore();

    return getContractViem({
      address: fundraisingContractConfig.address,
      abi: fundraisingContractConfig.abi,
      client: { public: getPublicClient(), wallet: await getWallet() },
    });
  }

  function getCampaignFilters() {
    const contract = getReadContract();
    return contract.read
      .getAllCampaignFilters()
      .then((res) => res.map((filter) => filter.replace(/_/g, " ")));
  }

  function getCampaign(index: number) {
    const contract = getReadContract();
    return contract.read
      .getCampaign([BigInt(index)])
      .then((res) => prettifyCampaign(index, res));
  }

  function getCampaigns(startIndex: number, endIndex: number) {
    const contract = getReadContract();
    const indexArray = Array.from({ length: endIndex - startIndex }, (_, i) =>
      BigInt(i + startIndex),
    );
    return contract.read
      .getCampaignSummaries([indexArray])
      .then((res) => prettifyCampaignArray(res));
  }

  function getCampaignContributions(campaignIndex: number) {
    const contract = getReadContract();
    return contract.read.getContributions([BigInt(campaignIndex)]);
  }

  function getLastCampaignIndex() {
    const contract = getReadContract();
    return contract.read.nextCampaignId().then((res) => Number(res));
  }

  function searchCampaigns(
    startDate: number,
    endDate: number,
    filters: string[],
  ) {
    const contract = getReadContract();
    return contract.read
      .searchCampaigns([BigInt(startDate), BigInt(endDate), filters])
      .then((res) => prettifyCampaignArray(res));
  }

  async function createCampaign(
    goalAmount: number,
    ipfsHash: string,
    filters: string[],
  ) {
    const contract = await getWriteContract();
    return contract.write.createCampaign([
      BigInt(goalAmount),
      ipfsHash,
      filters,
    ]);
  }

  async function stopCampaign(campaignId: number) {
    const contract = await getWriteContract();
    return contract.write.stopCampaign([BigInt(campaignId)]);
  }

  async function withdrawCampaignFunds(campaignId: number) {
    const contract = await getWriteContract();
    return contract.write.withdrawFunds([BigInt(campaignId)]);
  }

  async function contributeCampaign(campaignId: number) {
    // How to pay here? Method is payable
    const contract = await getWriteContract();
    return contract.write.contribute([BigInt(campaignId)]);
  }

  return {
    getCampaign,
    getCampaigns,
    searchCampaigns,
    getCampaignFilters,
    getCampaignContributions,
    getLastCampaignIndex,

    createCampaign,
    stopCampaign,
    withdrawCampaignFunds,
    contributeCampaign,
  };
});

function prettifyCampaign(
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
  ],
) {
  return {
    id,
    goalAmount: Number(campaign[1]),
    createdAt: bigIntToDate(campaign[2]),
    raisedAmount: Number(campaign[3]),
    ipfsHash: campaign[4],
    isOpen: campaign[5],
    filters: campaign[6],
    contributions: campaign[7],
  };
}

function prettifyCampaignArray(
  campaigns: readonly [
    readonly {
      id: bigint;
      organizer: `0x${string}`;
      createdAt: bigint;
      goalAmount: bigint;
      raisedAmount: bigint;
      isOpen: boolean;
      ipfsHash: string;
    }[],
    readonly (readonly string[])[],
  ],
) {
  const campaignsData = campaigns[0];
  const campaignsFilters = campaigns[1];

  return campaignsData.map((campaign, index) => ({
    id: Number(campaign.id),
    goalAmount: Number(campaign.goalAmount),
    createdAt: bigIntToDate(campaign.createdAt),
    raisedAmount: Number(campaign.raisedAmount),
    isOpen: campaign.isOpen,
    ipfsHash: campaign.ipfsHash,
    filters: campaignsFilters[index],
    contributions: [],
  }));
}

function bigIntToDate(value: bigint) {
  return Number(value) * 1000;
}
