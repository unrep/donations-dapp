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

  async function getCampaign(index: number) {
    const contract = getReadContract();
    const ethData = await getEthData();
    if (!ethData.value) return;
    const decimals = ethData.value.tokenDecimal;
    return contract.read
      .getCampaign([BigInt(index)])
      .then((res) => prettifyCampaign(index, res, +decimals));
  }

  async function getCampaigns(startIndex: number, endIndex: number) {
    const contract = getReadContract();
    const ethData = await getEthData();
    if (!ethData.value) return;
    const decimals = ethData.value.tokenDecimal;
    const indexArray = Array.from({ length: endIndex - startIndex }, (_, i) =>
      BigInt(i + startIndex),
    );
    return contract.read
      .getCampaignSummaries([indexArray])
      .then((res) => prettifyCampaignArray(res, +decimals));
  }

  function getCampaignContributions(campaignIndex: number) {
    const contract = getReadContract();
    return contract.read.getContributions([BigInt(campaignIndex)]);
  }

  function getLastCampaignIndex() {
    const contract = getReadContract();
    return contract.read.nextCampaignId().then((res) => Number(res));
  }

  async function searchCampaigns(
    startDate: number,
    endDate: number,
    filters: string[],
  ) {
    const contract = getReadContract();
    const ethData = await getEthData();
    if (!ethData.value) return;
    const decimals = ethData.value.tokenDecimal;
    return contract.read
      .searchCampaigns([BigInt(startDate), BigInt(endDate), filters])
      .then((res) => prettifyCampaignArray(res, +decimals));
  }

  async function createCampaign(
    goalAmount: number,
    ipfsHash: string,
    filters: string[],
  ) {
    const contract = await getWriteContract();
    const ethData = await getEthData();
    if (!ethData.value) return;
    const goalAmountInWei = BigInt(
      decimalToBigNumber(goalAmount.toString(), +ethData.value.tokenDecimal),
    );
    return contract.write.createCampaign([goalAmountInWei, ipfsHash, filters]);
  }

  async function stopCampaign(campaignId: number) {
    const contract = await getWriteContract();
    return contract.write.stopCampaign([BigInt(campaignId)]);
  }

  async function withdrawCampaignFunds(campaignId: number) {
    const contract = await getWriteContract();
    return contract.write.withdrawFunds([BigInt(campaignId)]);
  }

  async function contributeCampaign(campaignId: string, amount: string) {
    const contract = await getWriteContract();
    const ethData = await getEthData();
    if (!ethData.value) return;
    return contract.write.contribute([BigInt(campaignId)], {
      value: BigInt(decimalToBigNumber(amount, +ethData.value.tokenDecimal)),
    });
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
  decimals: number,
) {
  return {
    id,
    goalAmount: weiToNumber(campaign[1], decimals),
    createdAt: bigIntToDate(campaign[2]),
    raisedAmount: weiToNumber(campaign[3], decimals),
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
  decimals: number,
) {
  const campaignsData = campaigns[0];
  const campaignsFilters = campaigns[1];

  return campaignsData.map((campaign, index) => ({
    id: Number(campaign.id),
    goalAmount: weiToNumber(campaign.goalAmount, decimals),
    createdAt: bigIntToDate(campaign.createdAt),
    raisedAmount: weiToNumber(campaign.raisedAmount, decimals),
    isOpen: campaign.isOpen,
    ipfsHash: campaign.ipfsHash,
    filters: campaignsFilters[index],
    contributions: [],
  }));
}

function bigIntToDate(value: bigint) {
  return Number(value) * 1000;
}
