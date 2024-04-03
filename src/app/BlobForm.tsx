"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { supportedNetworks } from "@/lib/supportedNetworks";
import { getRandomBlobText } from "@/lib/getRandomBlobText";
import { isBlobSizeWithinLimit } from "@/lib/isBlobSizeWithinLimit";
import { Hex } from "viem";

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
  networkId: z.coerce
    .number()
    .refine((val) =>
      supportedNetworks.map((network) => Number(network.id)).includes(val),
    ),
});

const defaultValues = {
  networkId: 11155111,
  privateKey: "" as Hex,
  blobContents: "",
};

type BlobFormProps = {
  onSubmit: (data: z.infer<typeof formSchema>) => any;
};

export const BlobForm: React.FC<BlobFormProps> = ({ onSubmit }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { formState, setValue, handleSubmit } = form;
  const { isSubmitting } = formState;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
                      placeholder="Your delightful blob..."
                      disabled={isSubmitting}
                      className="min-h-40"
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
                <Input placeholder="0x..." disabled={isSubmitting} {...field} />
              </FormControl>
              <FormDescription>Only use burner wallets</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="networkId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Network</FormLabel>
              <Select
                value={String(field.value)}
                name={field.name}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder="Select Network"
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {supportedNetworks.map((network) => (
                    <SelectItem key={network.id} value={String(network.id)}>
                      {network.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          Submit
        </Button>
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
            className="absolute bottom-2 right-2 text-slate-700 opacity-0 transition-all disabled:opacity-0 group-hover:opacity-100 group-hover:disabled:opacity-0"
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
