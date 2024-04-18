"use client";

import { useCallback, useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Hex, isAddress } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { ChevronsUpDown, Copy, Info } from "lucide-react";

import { supportedChains } from "@/lib/supportedChains";
import { getRandomBlobText } from "@/lib/getRandomBlobText";
import { isBlobSizeWithinLimit } from "@/lib/isBlobSizeWithinLimit";

const formSchema = z.object({
  privateKey: z
    .string()
    .trim()
    .transform((val) => (val.startsWith("0x") ? val : `0x${val}`) as Hex)
    .refine((val) => val.length === 66, {
      message: "Private key needs to be 64 characters long",
    }),
  blobContents: z
    .string()
    .min(1, { message: "Blob cannot be empty" })
    .refine((val) => isBlobSizeWithinLimit(val), {
      message: "Blob can have a maximum of 1024 bytes",
    }),
  chainId: z.coerce
    .number()
    .refine((val) =>
      supportedChains.map((chain) => Number(chain.id)).includes(val),
    ),

  // Optional fields
  to: z
    .string()
    .trim()
    .optional()
    .transform(
      (val) => (!val || val.startsWith("0x") ? val : `0x${val}`) as Hex,
    )
    .refine((val) => !val || isAddress(val), {
      message: "Please provide a valid address",
    }),
  maxFeePerBlobGasInGwei: z.coerce.number(),
  value: z.coerce.number().optional(),
  maxFeePerGasInGwei: z.coerce.number().optional(),
  maxPriorityFeePerGasInGwei: z.coerce.number().optional(),
  nonce: z.coerce.number().optional(),
  rpcUrl: z.string().url().or(z.literal("")).optional(),
});

const defaultValues = {
  chainId: 11155111,
  privateKey: "" as Hex,
  blobContents: "",
  to: "" as Hex,
  maxFeePerBlobGasInGwei: 500,
  value: 0,
  nonce: "" as unknown as number, // TODO: Fix type
  maxFeePerGasInGwei: "" as unknown as number, // TODO: Fix type
  maxPriorityFeePerGasInGwei: "" as unknown as number, // TODO: Fix type
  rpcUrl: "",
};

type BlobFormProps = {
  onSubmit: (data: z.infer<typeof formSchema>) => any;
};

export const BlobForm: React.FC<BlobFormProps> = ({ onSubmit }) => {
  const [showAdditionalSettings, setShowAdditionalSettings] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { formState, setValue, handleSubmit } = form;
  const { isSubmitting } = formState;

  const handleOnUsePrivateKey = useCallback(
    (privateKey: Hex) => {
      setValue("privateKey", privateKey);
    },
    [setValue],
  );

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="blobContents"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blob Contents</FormLabel>
              <FormControl>
                <div className="flex w-full flex-col gap-2">
                  <div className="group relative transition-opacity">
                    <Textarea
                      placeholder="Create and send a fresh blob directly from your browser..."
                      disabled={isSubmitting}
                      className="min-h-40 bg-background/40 backdrop-blur-md"
                      {...field}
                    />
                    <RandomBlobButton
                      disabled={isSubmitting}
                      onClick={() => {
                        setValue(field.name, getRandomBlobText());
                      }}
                    />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="privateKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Private Key</FormLabel>
              <FormControl>
                <Input
                  placeholder="0x..."
                  disabled={isSubmitting}
                  className="bg-background/40 backdrop-blur-md"
                  {...field}
                />
              </FormControl>
              <FormDescription className="flex items-center">
                Only use burner wallets{" "}
                <PrivateKeyInfoButton onUsePrivateKey={handleOnUsePrivateKey} />
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="chainId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chain</FormLabel>
              <Select
                value={String(field.value)}
                name={field.name}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger className="bg-background/40 backdrop-blur-md">
                    <SelectValue
                      placeholder="Select Chain"
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {supportedChains.map((chain) => (
                    <SelectItem key={chain.id} value={String(chain.id)}>
                      {chain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Collapsible
          open={showAdditionalSettings}
          onOpenChange={setShowAdditionalSettings}
        >
          <div className="flex justify-center">
            <CollapsibleTrigger
              asChild
              className="text-muted-foreground backdrop-blur-md hover:bg-accent/40"
            >
              <Button variant="ghost" size="sm">
                {showAdditionalSettings ? "Hide" : "Show"} Additional Settings
                <ChevronsUpDown className="ml-2 h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <div className="my-8 grid gap-8 md:grid-flow-col md:grid-cols-3">
              <FormField
                control={form.control}
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0x..."
                        disabled={isSubmitting}
                        className="bg-background/40 backdrop-blur-md"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Transactions are sent to the null address per default
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tx Value</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        min="0"
                        step="0.0000000000001"
                        disabled={isSubmitting}
                        className="bg-background/40 backdrop-blur-md"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>In ETH</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nonce"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nonce</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="42"
                        min="0"
                        disabled={isSubmitting}
                        className="bg-background/40 backdrop-blur-md"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Only customize this when trying to override another TX
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="my-8 grid gap-8 md:grid-flow-col md:grid-cols-3">
              <FormField
                control={form.control}
                name="maxFeePerBlobGasInGwei"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>maxFeePerBlobGas</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="50"
                        disabled={isSubmitting}
                        className="bg-background/40 backdrop-blur-md"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      In Gwei, not set automatically
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxFeePerGasInGwei"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>maxFeePerGas</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="50"
                        disabled={isSubmitting}
                        className="bg-background/40 backdrop-blur-md"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      In Gwei, set automatically
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxPriorityFeePerGasInGwei"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>maxPriorityFeePerGas</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="50"
                        disabled={isSubmitting}
                        className="bg-background/40 backdrop-blur-md"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      In Gwei, set automatically
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="rpcUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RPC URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://rpc.sepolia.org/"
                      disabled={isSubmitting}
                      className="bg-background/40 backdrop-blur-md"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Use this when your transaction fails because the method
                    handler crashed
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CollapsibleContent>
        </Collapsible>

        <div className="flex justify-center">
          <Button type="submit" disabled={isSubmitting}>
            Send Blob
          </Button>
        </div>
      </form>
    </Form>
  );
};

const RandomBlobButton: React.FC<{
  onClick: () => void;
  disabled: boolean;
}> = ({ onClick, disabled }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-2 right-2 text-slate-700 transition-all disabled:opacity-0 group-hover:opacity-100 group-hover:disabled:opacity-0 md:opacity-0"
            onClick={onClick}
            disabled={disabled}
            type="button"
          >
            <SparklesIcon />
          </Button>
        </TooltipTrigger>

        <TooltipContent side="right" sideOffset={16}>
          <p>Generate Random Blob</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const SparklesIcon = () => (
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
      d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
    />
  </svg>
);
const PrivateKeyInfoButton = ({
  onUsePrivateKey,
}: {
  onUsePrivateKey: (privateKey: Hex) => void;
}) => {
  const { burnerPrivateKey, burnerPublicKey } = useMemo(() => {
    const burnerPrivateKey = generatePrivateKey();
    const burnerAccount = privateKeyToAccount(burnerPrivateKey);
    const burnerPublicKey = burnerAccount.address;

    return { burnerPrivateKey, burnerPublicKey };
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="ml-1 h-6 w-6 text-muted-foreground"
        >
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Why add a private key?</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-4">
              <p className="mb-4 mt-6 max-h-[650px] rounded-lg border border-red-500 bg-red-100 p-4 text-red-500 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
                <b>Your funds might be at risk</b> if you don&apos;t use a
                burner wallet!
              </p>
              <p>
                With the Blob Creator, you can send blobs directly from your
                browser. But wallets like Metamask currently do not support this
                out of the box. So to send blobs, we are using a private key to
                interact with the Ethereum network directly.
              </p>
              <p>
                You can use the keys below for your fresh burner wallet. Save
                them in a secure place. Add some funds from your main wallet or
                by using a testnet faucet (make sure to send funds on the
                correct chain).
              </p>

              <hr />

              <div className="flex items-end gap-2">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="burnerPrivateKey">Private Key</Label>
                  <Input
                    id="burnerPrivateKey"
                    defaultValue={burnerPrivateKey}
                    readOnly
                  />
                </div>
                <Button
                  size="sm"
                  className="p-3 py-5"
                  variant="outline"
                  onClick={async () => {
                    await navigator.clipboard.writeText(burnerPrivateKey);
                    toast.success("Private Key copied to clipboard");
                  }}
                >
                  <span className="sr-only">Copy</span>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-end gap-2">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="burnerPublicKey">Public Key</Label>
                  <Input
                    id="burnerPublicKey"
                    defaultValue={burnerPublicKey}
                    readOnly
                  />
                </div>
                <Button
                  size="sm"
                  className="p-3 py-5"
                  variant="outline"
                  onClick={async () => {
                    await navigator.clipboard.writeText(burnerPublicKey);
                    toast.success("Public Key copied to clipboard");
                  }}
                >
                  <span className="sr-only">Copy</span>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 sm:justify-center">
          <DialogClose asChild>
            <Button onClick={() => onUsePrivateKey(burnerPrivateKey)}>
              Use Private Key
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
