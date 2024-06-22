import type { Address } from "viem";
import type { Token } from "~/types";

import { fundraisingABI } from "~/utils/contract/abi";

export const ETH_TOKEN: Token = {
  address: "0x000000000000000000000000000000000000800A",
  l1Address: "0x0000000000000000000000000000000000000000",
  symbol: "ETH",
  name: "Ether",
  decimals: 18,
  iconUrl: "/img/eth.svg",
};

export const fundraisingContractConfig = {
  address: process.env.FUNDRAISING_CONTRACT_ADRESS as Address,
  abi: fundraisingABI,
} as const;
