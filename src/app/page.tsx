"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import { type Hex } from "viem";

import { sendBlobTransaction } from "@/lib/sendBlobTransaction";
import { BlobForm } from "./BlobForm";

export default function Home() {
  const [submittedHash, setSubmittedHash] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  // const blobExplorerRootUrl = chain ? blobscanUrls[chain.name] : undefined;
  // const explorerUrl = chain?.blockExplorers.default.url;

  const handleSendTransaction = useCallback(
    async ({
      privateKey,
      networkId,
      blobContents,
    }: {
      privateKey: Hex;
      networkId: number;
      blobContents: string;
    }) => {
      const sendBlobTransactionPromise = sendBlobTransaction({
        blobContents,
        privateKey,
        networkId,
      });

      const toastId = toast.promise(sendBlobTransactionPromise, {
        loading: "Submitting Blob...",
        success: (hash) => {
          console.log("Submitted Blob Tx:", hash);
          setSubmittedHash(hash);
          return "Blob successfully submitted";
        },
        error:
          "There was an error submitting your Blob. Please check the console for details.",
      });
      sendBlobTransactionPromise.then(() => {
        toast.success("Blob successfully submitted", {
          duration: 8000,
          id: toastId,
          action: {
            label: "Show Details",
            onClick: () => setDialogOpen(true),
          },
        });
      });

      return sendBlobTransactionPromise;
    },
    [],
  );
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <h1 className="mb-6 text-center text-4xl font-bold tracking-tight">
        Delightful Blobs ✨
      </h1>

      {/* <SuccessDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        submittedHash={submittedHash}
        explorerUrl={explorerUrl}
        blobExplorerRootUrl={blobExplorerRootUrl}
      /> */}

      <div className="w-full">
        <BlobForm onSubmit={handleSendTransaction} />
      </div>
    </div>
  );
}
