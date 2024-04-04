"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

import { type Hex } from "viem";

import { sendBlobTransaction } from "@/lib/sendBlobTransaction";
import { BlobForm } from "./BlobForm";
import { SuccessDialog } from "./SuccessDialog";

import EphemaLogo from "./logo.png";

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
    <div className="mt-20 flex h-full flex-col items-center gap-4">
      <div className="text-center">
        <div className="mb-4 flex items-center justify-center text-sm text-muted-foreground">
          <Link
            href="https://www.ephema.io"
            className="mx-2 flex items-center text-purple-500 transition-colors hover:text-purple-600 dark:text-purple-300 dark:hover:text-purple-400"
          >
            <Image
              src={EphemaLogo}
              alt="ephema logo"
              className="mr-2 h-8 w-8 translate-y-0.5"
            />
          </Link>
        </div>
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
