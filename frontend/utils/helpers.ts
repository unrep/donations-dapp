import { waitForTransactionReceipt } from "@wagmi/core";

import { decimalToBigNumber } from "./formatters";

import { wagmiConfig } from "~/data/wagmi";

export const isMobile = () => {
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    navigator.userAgent,
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
  options: RetryOptions = {},
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

export function isOnlyZeroes(value: string) {
  return value.replace(/0/g, "").replace(/\./g, "").length === 0;
}

export function computeETHPrice(amount: number): string {
  if (!ethData.value) return "$0";

  return formatTokenPrice(
    decimalToBigNumber(amount, +ethData.value.tokenDecimal),
    ETH_TOKEN.decimals,
    +ethData.value.tokenPriceUSD,
  );
}

export async function convertUsdToEth(usdAmount: number): Promise<number> {
  const ethData = await getEthData();
  if (!ethData.value) return 0;

  return usdAmount / +ethData.value.tokenPriceUSD;
}

export async function awaitTransactionResponse(fn: () => Promise<any>) {
  const txHash = await fn();
  return waitForTransactionReceipt(wagmiConfig, { hash: txHash });
}
