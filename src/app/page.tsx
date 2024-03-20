"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import { useAccount, useConfig, useConnectorClient } from "wagmi";

import { Account } from "./account";
import { WalletOptions } from "./wallet-options";

import { sendBlobTransaction } from "@/lib/sendBlobTransaction";
import { useCallback, useState } from "react";
import { getRandomBlobText } from "@/lib/getRandomBlobText";
import Link from "next/link";

import { toast } from "sonner";
import { getShortAddress } from "@/lib/getShortAddress";

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blobContents, setBlobContents] = useState("");
  const [submittedHash, setSubmittedHash] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { isConnected } = useAccount();
  const wagmiConfig = useConfig();
  const { data: walletClient } = useConnectorClient(wagmiConfig);
  const sendTransaction = useCallback(async () => {
    setIsSubmitting(true);
    const sendBlobTransactionPromise = sendBlobTransaction(
      blobContents,
      walletClient,
    );
    const toastId = toast.promise(sendBlobTransactionPromise, {
      loading: "Submitting Blob...",
      success: (hash) => {
        console.log("Submitted Blob Tx:", hash);
        setSubmittedHash(hash);
        return "Blob successfully submitted";
      },
      error:
        "There was an error submitting your Blob. Please check the console.",
    });
    sendBlobTransactionPromise.then(() => {
      setIsSubmitting(false);
      toast.success("Blob successfully submitted", {
        duration: 8000,
        id: toastId,
        action: {
          label: "Show Details",
          onClick: () => setDialogOpen(true),
        },
      });
    });
  }, [blobContents, walletClient]);
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <h1 className="mb-6 text-center text-4xl font-bold tracking-tight">
        Delightful Blobs ✨
      </h1>

      <Dialog
        open={dialogOpen}
        onOpenChange={(isOpen) => setDialogOpen(isOpen)}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription asChild>
              <div>
                <span>Your transaction was successfully submitted.</span>
                <Table className="my-8">
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Tx Hash</TableCell>
                      <TableCell>
                        {submittedHash && (
                          <Link
                            className="text-blue-500"
                            target="_blank"
                            rel="external noopener noreferrer"
                            href={`https://sepolia.etherscan.io/tx/${submittedHash}`}
                          >
                            {getShortAddress(submittedHash)}
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Blobscan</TableCell>
                      <TableCell>
                        <Link
                          className="text-blue-500"
                          target="_blank"
                          rel="external noopener noreferrer"
                          href={`https://sepolia.blobscan.com/tx/${submittedHash}`}
                        >
                          Open Link
                        </Link>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {isConnected && <Account />}

      {isConnected ? (
        <div className="flex w-full flex-col gap-5">
          <div className="transition-opactiy group relative">
            <Textarea
              placeholder="Your delightful blob..."
              onChange={(e) => setBlobContents(e.target.value)}
              value={blobContents}
              disabled={isSubmitting}
              className="min-h-40"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute bottom-2 right-2 text-slate-700 opacity-0 transition-all disabled:opacity-0 group-hover:opacity-100 group-hover:disabled:opacity-0"
                    onClick={() => setBlobContents(getRandomBlobText())}
                    disabled={isSubmitting}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                      />
                    </svg>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={16}>
                  <p>Use Random Blob</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex justify-center">
            <Button onClick={() => sendTransaction()} disabled={isSubmitting}>
              Send Blob
            </Button>
          </div>
        </div>
      ) : (
        <WalletOptions />
      )}
    </div>
  );
}
