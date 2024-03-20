import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";
import { Badge } from "@/components/ui/badge";
import { getShortAddress } from "@/lib/getShortAddress";

export function Account() {
  const { address, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });
  const avatar = ensAvatar ?? undefined;

  return (
    <div className="group mb-8 flex items-center justify-center gap-4 text-slate-400">
      <Avatar>
        <AvatarImage src={avatar} />
        <AvatarFallback>0x</AvatarFallback>
      </Avatar>
      <div className="relative flex items-center gap-2">
        <span className="block text-sm transition-transform group-hover:-translate-y-2">
          {ensName
            ? `${ensName} (${getShortAddress(address)})`
            : getShortAddress(address)}
        </span>
        <span className="ml-2">
          <Badge variant="outline">{chain.name}</Badge>
        </span>

        <button
          onClick={() => disconnect()}
          className="absolute bottom-0 translate-y-2 text-sm opacity-0 outline-none transition-all group-hover:translate-y-2 group-hover:text-blue-500 group-hover:opacity-100"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}
