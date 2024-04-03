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

import { supportedNetworks } from "@/lib/supportedNetworks";

export const sendBlobTransaction = async ({
  blobContents,
  privateKey,
  networkId,
}: {
  blobContents: string;
  privateKey: Hex;
  networkId: number;
}) => {
  const kzg = await getKZG();
  const walletClient = createViemWalletClient(privateKey, networkId);

  return walletClient.sendTransaction({
    blobs: toBlobs({ data: stringToHex(blobContents) }),
    kzg,
    maxFeePerBlobGas: parseGwei("500"), // TODO: Use correct estimate for blobs
    to: "0x0000000000000000000000000000000000000000",
  });
};

let kzgPromise: ReturnType<typeof loadKZG> | null = null;
const getKZG = async () => {
  if (!kzgPromise) {
    kzgPromise = loadKZG();
  }

  return kzgPromise;
};

const createViemWalletClient = (privateKey: Hex, networkId: number) => {
  const account = privateKeyToAccount(privateKey);
  const chain = getNetworkFromId(networkId);

  return createWalletClient({
    account,
    chain,
    transport: http(),
  });
};

const getNetworkFromId = (networkId: number) =>
  supportedNetworks.find((network) => network.id === networkId);
