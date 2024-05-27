import { fundraisingABI } from "./abi";

import type { Token } from "~/types";

export const ETH_TOKEN: Token = {
  address: "0x000000000000000000000000000000000000800A",
  l1Address: "0x0000000000000000000000000000000000000000",
  symbol: "ETH",
  name: "Ether",
  decimals: 18,
  iconUrl: "/img/eth.svg",
};

export const fundraisingContractConfig = {
  address: "0x1A2894885076934dAf5a398Ff216c6d665707bbA", // fundraising contract in local node
  abi: fundraisingABI,
} as const;
