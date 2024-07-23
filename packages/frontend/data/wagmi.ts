import { type Chain, zkSync, zkSyncSepoliaTestnet } from "@wagmi/core/chains";
import { defaultWagmiConfig } from "@web3modal/wagmi/vue";

export const projectId = useAppConfig().walletConnectProjectID;
if (!projectId)
  throw new Error("Missing WalletConnect project ID in .env file");

const dockerizedLocalNode = {
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
} satisfies Chain;

export const chains = [
  zkSync,
  zkSyncSepoliaTestnet,
  ...(import.meta.env.MODE === "development" ? [dockerizedLocalNode] : []),
] as const;

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

export const chain =
  import.meta.env.MODE === "development" ? dockerizedLocalNode : zkSync;
