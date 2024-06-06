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
