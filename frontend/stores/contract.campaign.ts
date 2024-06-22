import { getBlock, watchContractEvent } from "@wagmi/core";
import { getContract as getContractViem, type Address } from "viem";

import { useOnboardStore } from "./onboard";

import { wagmiConfig } from "~/data/wagmi";

export const useContractCampaignStore = defineStore("contact_campaign", () => {
  const { getPublicClient } = useOnboardStore();

  function getReadContract() {
    return getContractViem({
      address: fundraisingContractConfig.address,
      abi: fundraisingContractConfig.abi,
      client: getPublicClient(),
    });
  }
  async function getWriteContract() {
    const { getWallet } = useOnboardStore();

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

  function getCampaignIdsByOrganizer(organizerAddress: Address) {
    const contract = getReadContract();
    return contract.read.getCampaignsByOrganizer([organizerAddress]);
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

  async function getIndexedCampaigns(indexes: number[]) {
    const contract = getReadContract();
    const ethData = await getEthData();
    if (!ethData.value) return;
    const decimals = ethData.value.tokenDecimal;
    const indexArray = indexes.map((index) => BigInt(index));
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
    const goalAmountInWei = decimalToBigNumber(
      goalAmount,
      +ethData.value.tokenDecimal,
    );
    return awaitTransactionResponse(() =>
      contract.write.createCampaign([goalAmountInWei, ipfsHash, filters]),
    );
  }

  async function stopCampaign(campaignId: number) {
    const contract = await getWriteContract();
    return awaitTransactionResponse(() =>
      contract.write.stopCampaign([BigInt(campaignId)]),
    );
  }

  async function withdrawCampaignFunds(campaignId: number) {
    const contract = await getWriteContract();
    return awaitTransactionResponse(() =>
      contract.write.withdrawFunds([BigInt(campaignId)]),
    );
  }

  async function contributeCampaign(campaignId: string, amount: bigint) {
    const contract = await getWriteContract();
    const ethData = await getEthData();
    if (!ethData.value) return;
    return awaitTransactionResponse(() =>
      contract.write.contribute([BigInt(campaignId)], {
        value: amount,
      }),
    );
  }

  function watchCampaignCreated(onLogs: (logs: any) => void) {
    return watchContractEvent(wagmiConfig, {
      address: fundraisingContractConfig.address,
      abi: fundraisingContractConfig.abi,
      eventName: "CampaignCreated",
      onLogs,
    });
  }

  function watchContributions(onLogs: (logs: any) => void) {
    return watchContractEvent(wagmiConfig, {
      address: fundraisingContractConfig.address,
      abi: fundraisingContractConfig.abi,
      eventName: "ContributionReceived",
      onLogs,
    });
  }

  function watchCampaignCompleted(onLogs: (logs: any) => void) {
    return watchContractEvent(wagmiConfig, {
      address: fundraisingContractConfig.address,
      abi: fundraisingContractConfig.abi,
      eventName: "CampaignCompleted",
      onLogs,
    });
  }

  async function getContributionEvents() {
    const { number: currentBlockNumber } = await getBlock(wagmiConfig);
    const blocksToFetch = 100n;
    return getPublicClient().getContractEvents({
      address: fundraisingContractConfig.address,
      abi: fundraisingContractConfig.abi,
      eventName: "ContributionReceived",
      fromBlock: currentBlockNumber - blocksToFetch,
    });
  }

  return {
    getCampaign,
    getCampaigns,
    getIndexedCampaigns,
    searchCampaigns,
    getCampaignFilters,
    getCampaignContributions,
    getLastCampaignIndex,
    getCampaignIdsByOrganizer,

    createCampaign,
    stopCampaign,
    withdrawCampaignFunds,
    contributeCampaign,

    watchCampaignCreated,
    watchContributions,
    watchCampaignCompleted,

    getContributionEvents,
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
    boolean,
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
    contributions: campaign[7].map((contribution) => ({
      ...contribution,
      timestamp: new Date(bigIntToDate(contribution.timestamp)),
    })),
    isWithdrawn: campaign[8],
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
      isWithdrawn: boolean;
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
    isWithdrawn: campaign.isWithdrawn,
  }));
}
