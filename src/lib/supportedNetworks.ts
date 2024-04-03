import { gnosis, holesky, mainnet, sepolia } from "viem/chains";

export const supportedNetworks = [sepolia, mainnet, holesky, gnosis] as const;

export const blobscanUrls = {
  Ethereum: "https://blobscan.com",
  Sepolia: "https://sepolia.blobscan.com",
  Gnosis: "https://gnosis.blobscan.com",
  Holesky: "https://holesky.blobscan.com",
} as const;

export const blobscanAPIUrls = {
  Ethereum: "https://api.blobscan.com",
  Sepolia: "https://api.sepolia.blobscan.com",
  Gnosis: "https://api.gnosis.blobscan.com",
  Holesky: "https://api.holesky.blobscan.com",
} as const;
