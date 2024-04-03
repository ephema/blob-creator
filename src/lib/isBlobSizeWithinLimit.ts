import { ByteArray, hexToBytes, size, stringToHex } from "viem";
import { maxBytesPerTransaction } from "@/lib/blobConstants";

export const isBlobSizeWithinLimit = (val: string) => {
  const data = hexToBytes(stringToHex(val)) as ByteArray;

  const dataSize = size(data);
  return dataSize <= maxBytesPerTransaction;
};
