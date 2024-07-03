import type { Address, Log } from "viem";

export type Hash = `0x${string}`;

export type TokenPrice = number | undefined;
export type Token = {
  address: string;
  l1Address?: string;
  name?: string;
  symbol: string;
  decimals: number;
  iconUrl?: string;
  price?: TokenPrice;
};

export declare namespace Api {
  namespace Response {
    type Collection<T> = {
      items: T[];
      meta: {
        currentPage: number;
        itemCount: number;
        itemsPerPage: number;
        totalItems: number;
        totalPages: number;
      };
      links: {
        first: string;
        last: string;
        next: string;
        previous: string;
      };
    };

    type Token = {
      l2Address: string;
      l1Address: string | null;
      name: string | null;
      symbol: string | null;
      decimals: number;
      usdPrice: number | null;
      liquidity: number | null;
      iconURL: string | null;
    };

    type Transfer = {
      from: string;
      to: string;
      blockNumber: number;
      transactionHash: string | null;
      amount: string | null;
      token: Token | null;
      tokenAddress: string;
      timestamp: string;
      type: "deposit" | "transfer" | "withdrawal" | "fee" | "mint" | "refund";
    };

    type TokenAddress = {
      balance: string;
      token: null | Token;
    };

    type Balances = {
      [tokenAddress: string]: TokenAddress;
    };

    type Account = {
      type: "account";
      address: string;
      blockNumber: number;
      balances: Balances;
      sealedNonce: number;
      verifiedNonce: number;
    };

    type Contract = {
      type: "contract";
      address: string;
      blockNumber: number;
      balances: Balances;
      bytecode: string;
      creatorAddress: string;
      creatorTxHash: string;
      createdInBlockNumber: number;
      totalTransactions: number;
    };

    type Transaction = {
      hash: string;
      to: string;
      from: string;
      transactionIndex: number;
      data: string;
      value: string;
      fee: string;
      nonce: number;
      blockNumber: number;
      blockHash: string;
      gasPrice: string;
      gasLimit: string;
      gasUsed: string;
      gasPerPubdata: string | null;
      maxFeePerGas: string | null;
      maxPriorityFeePerGas: string | null;
      receivedAt: string;
      commitTxHash: string | null;
      proveTxHash: string | null;
      executeTxHash: string | null;
      isL1Originated: boolean;
      l1BatchNumber: number | null;
      isL1BatchSealed: boolean;
      status: "included" | "committed" | "proved" | "verified" | "failed";
      error: string | null;
      revertReason: string | null;
    };

    type Finalizer_Withdrawal = {
      tx_hash: string;
      token: string;
      amount: string;
      status: "NotFinalized" | "Finalized";
    };
  }
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: string | HTMLElement,
        options: {
          sitekey: string;
          theme: "light" | "dark" | "auto";
          language: string;
          appearance: "always" | "execute" | "interaction-only";
          callback: (response: string) => void;
          "expired-callback": (response: string) => void;
          "error-callback": (response: string) => void;
        },
      ) => string | undefined;
      reset: (widgetId: string) => void;
    };
    rudderanalytics?: {
      load: (key: string, url: string) => void;
      ready: (callback: () => void) => void;
      page: () => void;
      track: (eventName: string, params?: unknown) => void;
      initialized: boolean;
    };
  }
}

export type Contribution = {
  campaignId: bigint;
  contributor: Address;
  amount: bigint;
  timestamp: bigint;
};

export interface Campaign {
  id: bigint;
  title: string;
  image: string;
  raised: bigint;
  goal: bigint;
  description: string;
  createdAt: bigint;
  isOpen: boolean;
  isWithdrawn: boolean;
  filters: string[];
  organizer: Address;
}

export interface CampaignWEvents extends Campaign {
  eventType: "created" | "contributed";
  eventTime: Date;
  latestContribution?: Contribution;
}

export interface LottieComponent {
  animationData?: Record<string, any>;
  animationLink?: string;
  width?: number | string;
  height?: number | string;
  speed?: number;
  direction?: "forward" | "reverse" | "alternate";
  loop?: number | boolean;
  autoPlay?: boolean;
  pauseAnimation?: boolean;
  pauseOnHover?: boolean;
  playOnHover?: boolean;
  delay?: number;
  backgroundColor?: string;
  noMargin?: boolean;
  scale?: number;
  assetsPath?: string;
  renderer?: "svg" | "canvas" | "html";
  rendererSettings?: Record<string, any>;

  play: () => void;
  pause: () => void;
  stop: () => void;
  destroy: () => void;
  setSpeed: (speed: number) => void;
  setDirection: (direction: "forward" | "reverse") => void;
  getDuration: (inFrames?: boolean) => number;
  goToAndStop: (frame: number, isFrame?: boolean) => void;
  goToAndPlay: (frame: number, isFrame?: boolean) => void;
  playSegments: (
    segments: [number, number] | [number, number][],
    forceFlag?: boolean,
  ) => void;
  setSubFrame: (useSubFrame: boolean) => void;
  updateDocumentData: (
    documentData: {
      t?: string;
      s?: number;
      fc?: [number, number, number];
      lh?: number;
      sc?: [number, number, number];
      j?: number;
    },
    index?: number,
  ) => void;
}

export type CampaignCreatedEventLog = Log<
  bigint,
  number,
  false,
  {
    readonly anonymous: false;
    readonly inputs: readonly [
      {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "campaignId";
        readonly type: "uint256";
      },
    ];
    readonly name: "CampaignCreated";
    readonly type: "event";
  },
  undefined
>;

export type ContributionsEventLog = Log<
  bigint,
  number,
  false,
  {
    readonly anonymous: false;
    readonly inputs: readonly [
      {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "campaignId";
        readonly type: "uint256";
      },
    ];
    readonly name: "ContributionReceived";
    readonly type: "event";
  },
  undefined
>;

export type CampaignCompletedEventLog = Log<
  bigint,
  number,
  false,
  {
    readonly anonymous: false;
    readonly inputs: readonly [
      {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "campaignId";
        readonly type: "uint256";
      },
    ];
    readonly name: "CampaignCompleted";
    readonly type: "event";
  },
  undefined
>;
