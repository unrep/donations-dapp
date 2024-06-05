import { decimalToBigNumber } from "./formatters";

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
    `https://block-explorer-api.mainnet.zksync.io/api?module=token&action=tokeninfo&contractaddress=${tokenAddress}`,
  ).then((res) => res.json());
  return res.result;
}
const ethData = (await getTokenData(ETH_TOKEN.address))[0];

export function computeETHPrice(amount: string): string {
  if (!ethData) return "$0";

  return formatTokenPrice(
    decimalToBigNumber(amount, +ethData.tokenDecimal),
    ETH_TOKEN.decimals,
    +ethData.tokenPriceUSD,
  );
}
