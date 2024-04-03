import {
  parseGwei,
  stringToHex,
  toBlobs,
  createWalletClient,
  http,
  type Hex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { loadKZG } from "kzg-wasm";

import { supportedChains } from "@/lib/supportedChains";

export const sendBlobTransaction = async ({
  blobContents,
  privateKey,
  chainId,
}: {
  blobContents: string;
  privateKey: Hex;
  chainId: number;
}) => {
  const kzg = await getKZG();
  const walletClient = createViemWalletClient(privateKey, chainId);

  const transactionHash = await walletClient.sendTransaction({
    blobs: toBlobs({ data: stringToHex(blobContents) }),
    kzg,
    maxFeePerBlobGas: parseGwei("500"), // TODO: Use correct estimate for blobs
    to: "0x0000000000000000000000000000000000000000",
  });

  return {
    transactionHash,
    chainId: chainId,
  };
};

let kzgPromise: ReturnType<typeof loadKZG> | null = null;
const getKZG = async () => {
  if (!kzgPromise) {
    kzgPromise = loadKZG();
  }

  return kzgPromise;
};

const createViemWalletClient = (privateKey: Hex, chainId: number) => {
  const account = privateKeyToAccount(privateKey);
  const chain = getChainFromId(chainId);

  return createWalletClient({
    account,
    chain,
    transport: http(),
  });
};

const getChainFromId = (chainId: number) =>
  supportedChains.find((chain) => chain.id === chainId);
