"use client";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { Copy } from "lucide-react";

type DialogProps = {
  dialogOpen: boolean;
  setDialogOpen: (isOpen: boolean) => void;
  transactionDetails: null | {
    transactionHash: string;
    transactionOnExplorerUrl: string;
    transactionOnBlobscanUrl: string;
  };
};
export const SuccessDialog: React.FC<DialogProps> = ({
  dialogOpen,
  setDialogOpen,
  transactionDetails,
}) => {
  const {
    transactionHash,
    transactionOnExplorerUrl,
    transactionOnBlobscanUrl,
  } = transactionDetails ?? {
    transactionHash: "",
    transactionOnExplorerUrl: "",
    transactionOnBlobscanUrl: "",
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Transaction Sent</DialogTitle>
          <DialogDescription>
            Your transaction was successfully submitted to the network
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="txHash" className="sr-only">
              Tx Hash
            </Label>
            <Input id="txHash" defaultValue={transactionHash} readOnly />
          </div>
          <Button
            size="sm"
            className="p-3 py-4"
            variant="outline"
            onClick={() => navigator.clipboard.writeText(transactionHash)}
          >
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="secondary" asChild>
            <Link
              target="_blank"
              rel="external noopener noreferrer"
              href={transactionOnBlobscanUrl}
            >
              View on Blobscan
            </Link>
          </Button>
          <Button type="button" variant="secondary" asChild>
            <Link
              target="_blank"
              rel="external noopener noreferrer"
              href={transactionOnExplorerUrl}
            >
              View on Etherscan
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
