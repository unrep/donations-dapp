const ethData = ref<{
  contractAddress: string;
  iconURL: string;
  l1Address: string;
  liquidity: string;
  symbol: string;
  tokenDecimal: string;
  tokenName: string;
  tokenPriceUSD: string;
}>();

export async function getEthData() {
  if (!ethData.value) {
    ethData.value = (await getTokenData(ETH_TOKEN.address))[0];
  }
  return ethData;
}

async function getTokenData(tokenAddress: string): Promise<
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
