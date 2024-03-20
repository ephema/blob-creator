import {
  parseGwei,
  stringToHex,
  toBlobs,
  WalletClient,
  JsonRpcAccount,
} from "viem";
import { loadKZG } from "kzg-wasm";

export const sendBlobTransaction = async (
  blobData: string,
  client: WalletClient,
) => {
  const kzg = await loadKZG();

  return client.sendTransaction({
    blobs: toBlobs({ data: stringToHex(blobData) }),
    kzg,
    maxFeePerBlobGas: parseGwei("200"),
    to: "0x0000000000000000000000000000000000000000",
  });
};
