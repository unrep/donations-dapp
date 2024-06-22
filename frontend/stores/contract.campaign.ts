import { getBlock, watchContractEvent } from "@wagmi/core";
import { getContract as getContractViem, type Address } from "viem";

import { useOnboardStore } from "./onboard";

import { wagmiConfig } from "~/data/wagmi";
import {
  prettifyCampaign,
  prettifyCampaignArray,
} from "~/utils/contract/campaignHelpers";

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

  function getCampaign(index: number) {
    const contract = getReadContract();
    return contract.read
      .getCampaign([BigInt(index)])
      .then((res) => prettifyCampaign(index, res));
  }

  function getCampaignIdsByOrganizer(organizerAddress: Address) {
    const contract = getReadContract();
    return contract.read.getCampaignsByOrganizer([organizerAddress]);
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

  function getIndexedCampaigns(indexes: number[]) {
    const contract = getReadContract();
    const indexArray = indexes.map((index) => BigInt(index));
    return contract.read
      .getCampaignSummaries([indexArray])
      .then(async (res) => {
        const campaigns = await Promise.all(
          res[0].map(async (campaign) => ({
            ...campaign,
            contributions: await getCampaignContributions(Number(campaign.id)),
          })),
        );
        return prettifyCampaignArray([campaigns, res[1]]);
      });
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
    const fromBlock =
      currentBlockNumber - blocksToFetch > 0n
        ? currentBlockNumber - blocksToFetch
        : 0n;

    return getPublicClient()
      .getContractEvents({
        address: fundraisingContractConfig.address,
        abi: fundraisingContractConfig.abi,
        eventName: "ContributionReceived",
        fromBlock,
      })
      .then((res) => res.map((event) => event.args));
  }

  async function getCreationEvents() {
    const { number: currentBlockNumber } = await getBlock(wagmiConfig);
    const blocksToFetch = 100n;

    const fromBlock =
      currentBlockNumber - blocksToFetch > 0n
        ? currentBlockNumber - blocksToFetch
        : 0n;

    return getPublicClient()
      .getContractEvents({
        address: fundraisingContractConfig.address,
        abi: fundraisingContractConfig.abi,
        eventName: "CampaignCreated",
        fromBlock,
      })
      .then((res) => res.map((event) => event.args));
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
    getCreationEvents,
  };
});
