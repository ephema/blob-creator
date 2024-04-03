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
  submittedHash: string | null;
  explorerUrl: string | undefined;
  blobExplorerRootUrl: string | undefined;
};
export const SuccessDialog: React.FC<DialogProps> = ({
  dialogOpen,
  setDialogOpen,
  submittedHash,
  explorerUrl,
  blobExplorerRootUrl,
}) => {
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
                    <TableCell>
                      {submittedHash && (
                        <Link
                          className="text-blue-500 hover:text-blue-400"
                          target="_blank"
                          rel="external noopener noreferrer"
                          href={`${explorerUrl}/tx/${submittedHash}`}
                        >
                          {getShortAddress(submittedHash)}
                        </Link>
                      )}
                      {submittedHash && blobExplorerRootUrl && (
                        <>
                          {" ("}
                          <Link
                            className="text-blue-500 hover:text-blue-400"
                            target="_blank"
                            rel="external noopener noreferrer"
                            href={`${blobExplorerRootUrl}/tx/${submittedHash}`}
                          >
                            Blobscan
                          </Link>
                          {")"}
                        </>
                      )}
                    </TableCell>
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
