import { type Chain, zkSync, zkSyncSepoliaTestnet } from "@wagmi/core/chains";
import { defaultWagmiConfig } from "@web3modal/wagmi/vue";

export const projectId = useAppConfig().walletConnectProjectID as string;
if (!projectId)
  throw new Error("Missing WalletConnect project ID in .env file");

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

const metadata = {
  name: "Donations Dapp",
  description: "Donations Dapp Template",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});
