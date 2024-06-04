import { getContract as getContractViem } from "viem";

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
    return contract.read.campaigns([BigInt(index)]);
  }

  function getCampaigns(startIndex: number, endIndex: number) {
    const contract = getReadContract();
    const indexArray = Array.from({ length: endIndex - startIndex }, (_, i) =>
      BigInt(i + startIndex),
    );
    return contract.read.getCampaignSummaries([indexArray]);
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
    return contract.read.searchCampaigns([
      BigInt(startDate),
      BigInt(endDate),
      filters,
    ]);
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
