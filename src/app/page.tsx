"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
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
      to,
      maxFeePerBlobGasInGwei,
      value,
      maxFeePerGasInGwei,
      maxPriorityFeePerGasInGwei,
      nonce,
      rpcUrl,
    }: {
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
      const sendBlobTransactionPromise = sendBlobTransaction({
        blobContents,
        privateKey,
        chainId,
        to,
        maxFeePerBlobGasInGwei,
        value,
        maxFeePerGasInGwei,
        maxPriorityFeePerGasInGwei,
        nonce,
        rpcUrl,
      });

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
    <div className="mt-24 flex h-full flex-col items-center gap-4">
      <div className="text-center">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">
          Delightful Blob Submitter ✨
        </h1>
        <p className="mb-1 text-muted-foreground">
          Create and send blobs directly from your browser
        </p>
        <div className="text-sm text-muted-foreground">
          a project by{" "}
          <Link
            href="https://www.ephema.io"
            className="text-purple-300 transition-colors hover:text-purple-400"
          >
            ephema
          </Link>
        </div>
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
