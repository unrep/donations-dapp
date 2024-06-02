import { getContract as getContractViem } from "viem";

import { useOnboardStore } from "./onboard";

export const useContractCampaignStore = defineStore("contact_campaign", () => {
  async function getContract() {
    const { getPublicClient, getWallet } = useOnboardStore();

    return getContractViem({
      address: fundraisingContractConfig.address,
      abi: fundraisingContractConfig.abi,
      client: {
        public: getPublicClient(),
        wallet: await getWallet(),
      },
    });
  }

  async function getCampaignFilters() {
    const contract = await getContract();
    return contract.read.getAllCampaignFilters();
  }

  async function getCampaign(index: number) {
    const contract = await getContract();
    return contract.read.campaigns([BigInt(index)]);
  }

  async function getCampaigns(startIndex: number, endIndex: number) {
    const contract = await getContract();
    const indexArray = Array.from({ length: endIndex - startIndex }, (_, i) =>
      BigInt(i + startIndex),
    );
    return contract.read.getCampaignSummaries([indexArray]);
  }

  async function getCampaignContributions(campaignIndex: number) {
    const contract = await getContract();
    return contract.read.getContributions([BigInt(campaignIndex)]);
  }

  async function getLastCampaignIndex() {
    const contract = await getContract();
    return contract.read.nextCampaignId();
  }

  async function searchCampaigns(
    startDate: number,
    endDate: number,
    filters: string[],
  ) {
    const contract = await getContract();
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
    const contract = await getContract();
    return contract.write.createCampaign([
      BigInt(goalAmount),
      ipfsHash,
      filters,
    ]);
  }

  async function stopCampaign(campaignId: number) {
    const contract = await getContract();
    return contract.write.stopCampaign([BigInt(campaignId)]);
  }

  async function withdrawCampaignFunds(campaignId: number) {
    const contract = await getContract();
    return contract.write.withdrawFunds([BigInt(campaignId)]);
  }

  async function contributeCampaign(campaignId: number) {
    // How to pay here? Method is payable
    const contract = await getContract();
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
