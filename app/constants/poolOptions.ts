import { BTCBgLogo, EthBgWhiteLogo } from "../components/assets";

// Define the Pool type
export interface Pool {
  name: string;
  contractAddress: string;
  tokenAddress: string;
  tokenDecimals: number;
  tokenSymbol: string;
  shareId: string;
  shareDecimals: number;
  shareSymbol: string;
  apy: string;
  expiration: string;
  underlying: string;
  img: any;
  ticker: string;
  reserves: string;
  minimum: string;
}

// Define the pool options
export const pool: any= [
  {
    name: "BTC (Sept-24)",
    contractAddress:
      "CASPEJVCB6TYJHLP3N6BNH7JEFVDC5QXQ7K4R5PV6HFA364CNY2N2XU5",
    tokenAddress: "CDJCX67YS7M6EOREWQ7MVVBX2CCQHOSTXF6ZQPADLEVQO26MUNABYLX2",
    tokenDecimals: 7,
    tokenSymbol: "USDC",
    shareId: "CDXTYSJLR6K26DH4TVBVW23K2DH3PEMCI3UH2IS52V3B5UZBD5XMF5KB",
    shareDecimals: 7,
    shareSymbol: "VST",
    apy: "9.01%",
    // expiration: "27, Sept 2024",
    underlying: "BTC Futures and Spot",
    img: BTCBgLogo,
    ticker: "BTC",
    reserves: "0",
    minimum: "100",
  },
  {
    name: "ETH (Sept-24)",
    contractAddress:
      "CCKPZMBQSBNWDNA24S253LEETE5GEVWVT5ZMOXHXNUNHJMXHPZAEPAC5",
    tokenAddress: "CDJCX67YS7M6EOREWQ7MVVBX2CCQHOSTXF6ZQPADLEVQO26MUNABYLX2",
    tokenDecimals: 7,
    tokenSymbol: "USDC",
    shareId: "CD4ZCXKIKSSYCIBZIZ47YJLNINH5VNBQTEDNWFPCLSMNEGCOO534FHLY",
    shareDecimals: 7,
    shareSymbol: "VST",
    apy: "9.66%",
    // expiration: "27, Sept 2024",
    underlying: "Ethereum Futures and Spot",
    img: EthBgWhiteLogo,
    ticker: "ETH",
    reserves: "0",
    minimum: "10",
  },
  {
    name: "BTC (Dec-24)",
    contractAddress:
      "CAQYTUKVK3VZBRIAFH26XMCHVOZNZQX5SQYWIJVNJSZABXIFKTGQV36Z",
    tokenAddress: "CDJCX67YS7M6EOREWQ7MVVBX2CCQHOSTXF6ZQPADLEVQO26MUNABYLX2",
    tokenDecimals: 7,
    tokenSymbol: "USDC",
    shareId: "CBXOCDPQGPJN2CUL7M7P2YRPTUIGRMRBZMKPWN3STQLMPZBEMWYD6AV3",
    shareDecimals: 7,
    shareSymbol: "VST",
    apy: "9.47%",
    // expiration: "27, Dec 2024",
    underlying: "BTC Futures and Spot",
    img: BTCBgLogo,
    ticker: "BTC",
    reserves: "0",
    minimum: "100",
  },
  {
    name: "ETH (Dec-24)",
    contractAddress:
      "CCLG4ZF6NF4XG3ZLMO5E4XWD3RLATXZFDB4SED5ZKTUHDOCJPQTY4MEM",
    tokenAddress: "CDJCX67YS7M6EOREWQ7MVVBX2CCQHOSTXF6ZQPADLEVQO26MUNABYLX2",
    tokenDecimals: 7,
    tokenSymbol: "USDC",
    shareId: "CBIN26XS25MZMS3XJA4UAEPZ2RJVHAWAN3N7LOXYMCTD3KZ66RF3XPUG",
    shareDecimals: 7,
    shareSymbol: "VST",
    apy: "9.20%",
    // expiration: "27, Dec 2024",
    underlying: "Ethereum Futures and Spot",
    img: EthBgWhiteLogo,
    ticker: "ETH",
    reserves: "0",
    minimum: "10",
  },
  ];
