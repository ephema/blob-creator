import { gnosis, holesky, mainnet, sepolia } from "viem/chains";

export const supportedChains = [sepolia, mainnet, holesky, gnosis] as const;

export const blobscanUrls = {
  Ethereum: "https://blobscan.com",
  Sepolia: "https://sepolia.blobscan.com",
  Gnosis: "https://gnosis.blobscan.com",
  Holesky: "https://holesky.blobscan.com",
} as const;
