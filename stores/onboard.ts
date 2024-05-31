import { useStorage } from "@vueuse/core";
import {
  getAccount,
  getPublicClient,
  getWalletClient,
  reconnect,
  switchChain,
  disconnect as walletDisconnect,
  watchAccount,
} from "@wagmi/core";
import { createWeb3Modal } from "@web3modal/wagmi";

import { projectId, wagmiConfig } from "~/data/wagmi";
import { confirmedSupportedWallets, disabledWallets } from "~/data/wallets";
import { formatError } from "~/utils/formatters";
import useObservable from "~/utils/useObservable";
import usePromise from "~/utils/usePromise";

import { useNetworkStore } from "./network";

export const useOnboardStore = defineStore("onboard", () => {
  const { selectedNetwork, l1Network } = storeToRefs(useNetworkStore());

  reconnect(wagmiConfig);

  const account = ref(getAccount(wagmiConfig));
  const connectingWalletError = ref<string | undefined>();
  const connectorName = ref(account.value.connector?.name);
  const walletName = ref<string | undefined>();
  const walletWarningDisabled = useStorage(
    "zksync-bridge-wallet-warning-disabled",
    false,
  );
  const walletNotSupported = computed(() => {
    if (walletWarningDisabled.value) return false;
    if (!walletName.value) return false;
    return !confirmedSupportedWallets.find(
      (wallet) => wallet === walletName.value,
    );
  });
  const identifyWalletName = async () => {
    const { connector } = getAccount(wagmiConfig);
    const provider = await connector?.getProvider?.();
    const name = (provider as any)?.session?.peer?.metadata?.name;
    if ((provider as any)?.isMetaMask) {
      walletName.value = "MetaMask";
    } else if (!name && connector?.name !== "WalletConnect") {
      walletName.value = connector?.name.replace(/ Wallet$/, "").trim();
    } else {
      walletName.value = name?.replace(/ Wallet$/, "").trim();
    }

    if (walletName.value && connector) {
      const isWalletDisabled = !!disabledWallets.find(
        (wallet) => wallet === walletName.value,
      );
      if (isWalletDisabled)
        throw new Error(
          `Unfortunately ${walletName.value} wallet is not supported at the moment!`,
        );
    }
  };

  const web3modal = createWeb3Modal({
    wagmiConfig,
    projectId: projectId!,
    termsConditionsUrl: "https://zksync.io/terms",
    privacyPolicyUrl: "https://zksync.io/privacy",
    themeMode: "light",
  });

  const web3ModalOpened = ref(false);
  web3modal.subscribeState((state) => (web3ModalOpened.value = state.open));

  web3modal.subscribeState((state) => {
    if (!state.open && account.value.isConnecting) {
      // when user closes the modal after selecting one of the options to connect
      // account is still in connecting state, so we need to reset it
      account.value = {
        address: undefined,
        addresses: undefined,
        chain: undefined,
        chainId: undefined,
        connector: undefined,
        isConnected: false,
        isConnecting: false,
        isDisconnected: true,
        isReconnecting: false,
        status: "disconnected",
      };
    }
  });
  watchAccount(wagmiConfig, {
    onChange: async (updatedAccount) => {
      try {
        await identifyWalletName();
        account.value = updatedAccount;
        connectorName.value = updatedAccount.connector?.name;
      } catch (err) {
        disconnect();
        const error = formatError(err as Error);
        if (error) {
          connectingWalletError.value = error.message;
        }
      }
    },
  });

  const openModal = () => web3modal.open();
  const disconnect = () => {
    const { connector } = getAccount(wagmiConfig);
    if (!connector) return;
    walletDisconnect(wagmiConfig, { connector });
  };

  const isCorrectNetworkSet = computed(() => {
    const walletNetworkId = account.value.chain?.id;
    return walletNetworkId === l1Network.value?.id;
  });
  const switchNetworkById = async (chainId: number, networkName?: string) => {
    try {
      return await switchChain(wagmiConfig, { chainId });
    } catch (err) {
      if (
        err instanceof Error &&
        err.message.includes("does not support programmatic chain switching")
      ) {
        throw new Error(
          `Please switch network manually to "${networkName}" in your ${walletName.value} wallet`,
        );
      }
      throw err;
    }
  };
  const {
    inProgress: switchingNetworkInProgress,
    error: switchingNetworkError,
    execute: switchNetwork,
  } = usePromise(
    async () => {
      if (!l1Network.value)
        throw new Error(
          `L1 network is not available on ${selectedNetwork.value.name}`,
        );
      return await switchNetworkById(l1Network.value.id);
    },
    { cache: false },
  );
  const setCorrectNetwork = async () => {
    return await switchNetwork().catch(() => undefined);
  };

  const { subscribe: subscribeOnAccountChange, notify: notifyOnAccountChange } =
    useObservable<string | undefined>();
  watch(
    () => account.value.address,
    () => {
      notifyOnAccountChange(account.value.address);
    },
  );

  const getWallet = async (
    chainId: number | undefined = l1Network.value?.id,
  ) => {
    const client = await getWalletClient(
      wagmiConfig,
      chainId ? { chainId } : undefined,
    );
    if (!client) throw new Error("Wallet is not available");

    return client;
  };

  return {
    account: computed(() => account.value),
    isConnected: computed(() => !!account.value.address),
    isConnectingWallet: computed(() => account.value.isReconnecting), // isConnecting already has a web3modal overlay
    connectingWalletError,
    connectorName,
    walletName,
    walletWarningDisabled,
    walletNotSupported,
    openModal,
    web3ModalOpened,
    disconnect,

    isCorrectNetworkSet,
    switchingNetworkInProgress,
    switchingNetworkError,
    setCorrectNetwork,
    switchNetworkById,

    getWallet,
    getPublicClient: () => {
      const publicClient = getPublicClient(wagmiConfig);
      if (!publicClient) {
        throw new Error("Public client is not available");
      }
      return publicClient;
    },

    subscribeOnAccountChange,
  };
});
