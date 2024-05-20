import {
  getAccount,
  getClient,
  getWalletClient,
  watchAccount,
} from "@wagmi/core";
import { zkSync, zkSyncSepoliaTestnet } from "@wagmi/core/chains";
import { getContract } from "viem";

import { wagmiConfig, chains } from "~/data/wagmi";
import { fundraisingContractConfig } from "~/utils/contracts";

export const defaultChain =
  import.meta.env.MODE === "development" ? zkSyncSepoliaTestnet : zkSync;

export const useWagmi = defineStore("wagmi", () => {
  // const publicClient = getClient(wagmiConfig);
  // if (!publicClient) throw new Error("Public client is not available");
  // const walletClient = await getWalletClient(wagmiConfig);
  // if (!walletClient) throw new Error("Wallet client is not available");

  // const contract = getContract({
  //   address: fundraisingContractConfig.address,
  //   abi: fundraisingContractConfig.abi,

  //   client: {
  //     public: publicClient,
  //     wallet: walletClient,
  //   },
  // });

  const account = ref(getAccount(wagmiConfig));
  const network = computed(() =>
    chains.find((chain) => chain.id === account.value.chainId)
  );
  watchAccount(wagmiConfig, {
    onChange(updatedAccount) {
      account.value = updatedAccount;
    },
  });

  return {
    account,
    network,
    // contract,
  };
});
