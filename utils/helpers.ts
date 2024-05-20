import { parseUnits } from "ethers";

import type { ZkSyncNetwork } from "@/data/networks";
import type { BigNumberish } from "ethers";
import type { TokenAmount } from "~/types";

export function isOnlyZeroes(value: string) {
  return value.replace(/0/g, "").replace(/\./g, "").length === 0;
}

export function calculateFee(gasLimit: BigNumberish, gasPrice: BigNumberish) {
  return BigInt(gasLimit) * BigInt(gasPrice);
}

export const getNetworkUrl = (network: ZkSyncNetwork, routePath: string) => {
  const url = new URL(routePath, window.location.origin);
  url.searchParams.set("network", network.key);
  return url.toString();
};

export const isMobile = () => {
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    navigator.userAgent
  );
};

export const calculateTotalTokensPrice = (tokens: TokenAmount[]) => {
  return tokens.reduce((acc, { amount, decimals, price }) => {
    if (typeof price !== "number") return acc;
    return acc + parseFloat(parseTokenAmount(amount, decimals)) * price;
  }, 0);
};

// Changes URL without changing actual router view
export const silentRouterChange = (
  location: string,
  mode: "push" | "replace" = "push"
) => {
  window.history[mode === "push" ? "pushState" : "replaceState"](
    {},
    "",
    location
  );
};

interface RetryOptions {
  retries?: number;
}
const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  retries: 2,
};
export async function retry<T>(
  func: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { retries } = Object.assign({}, DEFAULT_RETRY_OPTIONS, options);
  try {
    return await func();
  } catch (error) {
    if (retries && retries > 0) {
      return retry(func, { retries: retries - 1 });
    } else {
      throw error;
    }
  }
}

export async function getTokenData(tokenAddress: string): Promise<
  {
    contractAddress: string;
    iconURL: string;
    l1Address: string;
    liquidity: string;
    symbol: string;
    tokenDecimal: string;
    tokenName: string;
    tokenPriceUSD: string;
  }[]
> {
  const res = await fetch(
    `https://block-explorer-api.mainnet.zksync.io/api?module=token&action=tokeninfo&contractaddress=${tokenAddress}`
  ).then((res) => res.json());

  return res.result;
}
const ethData = (await getTokenData(ETH_TOKEN.address))[0];

export function computeETHPrice(amount: string): string {
  if (!ethData) return "$0";

  return formatTokenPrice(
    parseUnits(amount),
    ETH_TOKEN.decimals,
    +ethData.tokenPriceUSD
  );
}
