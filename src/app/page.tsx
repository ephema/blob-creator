"use client";

import { useCallback, useState } from "react";

import { toast } from "sonner";
import { type Hex } from "viem";

import { sendBlobTransaction } from "@/lib/sendBlobTransaction";
import { Logo } from "@/components/Logo";

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
    async (args: {
      privateKey: Hex;
      chainId: number;
      blobContents: string;
      to: Hex;
      maxFeePerBlobGasInGwei: number;
      value?: number;
      maxFeePerGasInGwei?: number;
      maxPriorityFeePerGasInGwei?: number;
      nonce?: number;
      rpcUrl?: string;
    }) => {
      const sendBlobTransactionPromise = sendBlobTransaction(args);
      toast.promise(sendBlobTransactionPromise, {
        loading: "Submitting Blob...",
        success: (transactionDetails) => {
          console.log("Blob Tx Submitted:", transactionDetails.transactionHash);
          setSubmittedTransactionDetails(transactionDetails);
          setDialogOpen(true);
          return "Blob successfully submitted";
        },
        error:
          "There was an error submitting your blob. Please check the console for details.",
      });

      return sendBlobTransactionPromise;
    },
    [],
  );
  return (
    <div className="mt-20 flex h-full flex-col items-center gap-4">
      <div className="text-center">
        <Logo />
        <h1 className="mb-2 text-4xl font-bold tracking-tight">
          Delightful Blob Submitter
        </h1>
        <p className="mb-1 text-muted-foreground">
          Create and send blobs directly from your browser ✨
        </p>
      </div>

      <SuccessDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        transactionDetails={submittedTransactionDetails}
      />

      <div className="mb-8 w-full">
        <BlobForm onSubmit={handleSendTransaction} />
      </div>
    </div>
  );
}
