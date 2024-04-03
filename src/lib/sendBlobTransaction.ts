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

import { blobscanUrls, supportedChains } from "@/lib/supportedChains";

export const sendBlobTransaction = async ({
  blobContents,
  privateKey,
  chainId,
  to,
  maxFeePerBlobGasInGwei,
  value,
  maxFeePerGasInGwei,
  maxPriorityFeePerGasInGwei,
  nonce,
}: {
  blobContents: string;
  privateKey: Hex;
  chainId: number;
  to: Hex;
  maxFeePerBlobGasInGwei: number;
  value: number;
  maxFeePerGasInGwei: number;
  maxPriorityFeePerGasInGwei: number;
  nonce: number;
}) => {
  const kzg = await getKZG();
  const walletClient = createViemWalletClient(privateKey, chainId);

  const txParams = {
    blobs: toBlobs({ data: stringToHex(blobContents) }),
    kzg,
    to: to || "0x0000000000000000000000000000000000000000",
    maxFeePerBlobGas: maxFeePerBlobGasInGwei
      ? parseGwei(String(maxFeePerBlobGasInGwei))
      : parseGwei("500"), // TODO: Use correct estimate for blobs
    value: value ? parseGwei(String(value)) : undefined,
    maxFeePerGas: maxFeePerGasInGwei
      ? parseGwei(String(maxFeePerGasInGwei))
      : undefined,
    maxPriorityFeePerGas: maxPriorityFeePerGasInGwei
      ? parseGwei(String(maxPriorityFeePerGasInGwei))
      : undefined,
    nonce: nonce ? nonce : undefined,
  };

  const transactionHash = await walletClient.sendTransaction(txParams);

  const chain = getChainFromId(chainId) ?? supportedChains[0];
  const transactionOnExplorerUrl = `${chain.blockExplorers.default.url}/tx/${transactionHash}`;
  const transactionOnBlobscanUrl = `${blobscanUrls[chain.name]}/tx/${transactionHash}`;

  return {
    transactionHash,
    transactionOnExplorerUrl,
    transactionOnBlobscanUrl,
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
