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
  address: "0xc0431C32561DabE0c8FD791B52590BbBA413c235", // fundraising contract in local node
  abi: fundraisingABI,
} as const;
