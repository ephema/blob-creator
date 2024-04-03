"use client";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import { getShortAddress } from "@/lib/getShortAddress";

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
                    {transactionDetails && (
                      <TableCell>
                        <Link
                          className="text-blue-500 hover:text-blue-400"
                          target="_blank"
                          rel="external noopener noreferrer"
                          href={transactionOnExplorerUrl}
                        >
                          {getShortAddress(transactionHash)}
                        </Link>

                        {" ("}
                        <Link
                          className="text-blue-500 hover:text-blue-400"
                          target="_blank"
                          rel="external noopener noreferrer"
                          href={transactionOnBlobscanUrl}
                        >
                          Blobscan
                        </Link>
                        {")"}
                      </TableCell>
                    )}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
