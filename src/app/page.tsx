"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import { type Hex } from "viem";

import { sendBlobTransaction } from "@/lib/sendBlobTransaction";
import { BlobForm } from "./BlobForm";
import { SuccessDialog } from "./SuccessDialog";

export default function Home() {
  const [submittedTransactionDetails, setSubmittedTransactionDetails] =
    useState<{
      transactionHash: string;
      transactionOnExplorerUrl: string;
      transactionOnBlobscanUrl: string;
    } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSendTransaction = useCallback(
    async ({
      privateKey,
      chainId,
      blobContents,
    }: {
      privateKey: Hex;
      chainId: number;
      blobContents: string;
    }) => {
      const sendBlobTransactionPromise = sendBlobTransaction({
        blobContents,
        privateKey,
        chainId,
      });

      const toastId = toast.promise(sendBlobTransactionPromise, {
        loading: "Submitting Blob...",
        success: (transactionDetails) => {
          console.log("Blob Tx Submitted:", transactionDetails.transactionHash);
          setSubmittedTransactionDetails(transactionDetails);
          setDialogOpen(true);
          return "Blob successfully submitted";
        },
        error:
          "There was an error submitting your Blob. Please check the console for details.",
      });

      return sendBlobTransactionPromise;
    },
    [],
  );
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <h1 className="mb-6 text-center text-4xl font-bold tracking-tight">
        Blob Submitter ✨
      </h1>

      <SuccessDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        transactionDetails={submittedTransactionDetails}
      />

      <div className="w-full">
        <BlobForm onSubmit={handleSendTransaction} />
      </div>
    </div>
  );
}
