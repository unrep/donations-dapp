import { fundraisingABI } from "~/utils/contract/abi";

import type { Token } from "~/types";

const appConfig = useAppConfig();

export const ETH_TOKEN: Token = {
  address: "0x000000000000000000000000000000000000800A",
  l1Address: "0x0000000000000000000000000000000000000000",
  symbol: "ETH",
  name: "Ether",
  decimals: 18,
  iconUrl: "/img/eth.svg",
};

export const fundraisingContractConfig = {
  address: appConfig.contract.address,
  abi: fundraisingABI,
} as const;
