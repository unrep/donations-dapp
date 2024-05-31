import { getContract, type Address } from "viem";

import { useOnboardStore } from "./onboard";

export const useContractCampaignStore = defineStore(
  "contact_campaign",
  async () => {
    const { getPublicClient } = useOnboardStore();
    const publicClient = getPublicClient();

    // const walletClient = await getWallet();

    const contract = getContract({
      address: fundraisingContractConfig.address as Address,
      abi: fundraisingContractConfig.abi,
      client: {
        public: publicClient,
        // wallet: walletClient,
      },
    });

    await contract.read.campaigns([BigInt(0)]);
  },
);
