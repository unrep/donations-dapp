import {
  getAccount,
  getClient,
  getWalletClient,
  watchAccount,
} from "@wagmi/core";
import { type Chain, zkSync, zkSyncSepoliaTestnet } from "@wagmi/core/chains";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/vue";
import { getContract } from "viem";

import { fundraisingContractConfig } from "~/utils/contracts";

export const chains: [Chain, ...Chain[]] = [
  zkSync,
  zkSyncSepoliaTestnet,
  ...(import.meta.env.MODE === "development"
    ? [
        {
          id: 270,
          name: "Dockerized local node",
          nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
          rpcUrls: {
            default: {
              http: ["http://localhost:3050"],
            },
            public: {
              http: ["http://localhost:3050"],
            },
          },
          blockExplorers: {
            default: {
              name: "Local Explorer",
              url: "http://localhost:3010",
            },
          },
          testnet: true,
        },
        {
          id: 260,
          name: "In-memory local node",
          nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
          rpcUrls: {
            default: {
              http: ["http://127.0.0.1:8011"],
            },
            public: {
              http: ["http://127.0.0.1:8011"],
            },
          },
          testnet: true,
        },
      ]
    : []),
];
export const defaultChain =
  import.meta.env.MODE === "development" ? zkSyncSepoliaTestnet : zkSync;

export const useWagmi = defineStore("wagmi", async () => {
  const projectId = useAppConfig().walletConnectProjectID as string;
  if (!projectId)
    throw new Error("Missing WalletConnect project ID in .env file");

  const metadata = {
    name: "Donations Dapp",
    description: "Donations Dapp Template",
    url: "https://web3modal.com",
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
  };

  const wagmiConfig = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
  });

  const publicClient = getClient(wagmiConfig);
  if (!publicClient) throw new Error("Public client is not available");
  const walletClient = await getWalletClient(wagmiConfig);
  if (!walletClient) throw new Error("Wallet client is not available");

  const contract = getContract({
    address: fundraisingContractConfig.address,
    abi: fundraisingContractConfig.abi,

    client: {
      public: publicClient,
      wallet: walletClient,
    },
  });

  createWeb3Modal({
    wagmiConfig,
    projectId,
    defaultChain,
    themeMode: "light",
  });

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
    contract,
  };
});
