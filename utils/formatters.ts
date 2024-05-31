import { getAddress, formatUnits } from "viem";

export function shortenAddress(address: string, chars = 3): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-3)}`;
}

export function formatTokenPrice(
  amount: bigint,
  decimals: number,
  _price: number,
): string {
  const price = parseFloat(formatUnits(amount, decimals)) * _price;
  if (!price) {
    return "$0.00";
  } else if (price < 0.01) {
    return "<$0.01";
  }
  return "$" + price.toFixed(2);
}

export function checksumAddress(address: string) {
  return getAddress(address.toLowerCase());
}

export function formatError(error?: Error) {
  if (!error?.message) {
    if (typeof error === "object" && (error as any).code === 4001) {
      return undefined;
    }
    error = Object.assign(new Error("Unknown error"), error);
  }
  const message = error?.message;
  if (typeof message === "string") {
    if (
      message.includes("User denied") ||
      message.includes("User rejected") ||
      message.includes("Rejected by user") ||
      // eslint-disable-next-line quotes
      message.includes('"Request rejected"') ||
      message.includes("user rejected transaction") ||
      message.includes("not configured for connector")
    ) {
      return undefined;
    } else if (message.toLowerCase().includes("fee is to low")) {
      return new Error("Transaction fee was to low. Try again.");
    } else if (
      message === "Network Error" ||
      message === "Failed to fetch" ||
      message.includes("<no response>") ||
      message.includes("noNetwork")
    ) {
      return new Error(
        "Network error. Check your internet connection and try again.",
      );
    }
  }
  return error;
}
