import { Button } from "@/components/ui/button";
import * as React from "react";
import { Connector, useConnect } from "wagmi";

export function WalletOptions() {
  const { connectors, connect } = useConnect();

  return connectors
    .slice(0, 1)
    .map((connector) => (
      <WalletOption
        key={connector.uid}
        connector={connector}
        onClick={() => connect({ connector })}
      />
    ));
}

function WalletOption({
  connector,
  onClick,
}: {
  connector: Connector;
  onClick: () => void;
}) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector]);

  const name =
    connector.name === "Injected" ? "Connect Wallet" : connector.name;

  return (
    <Button disabled={!ready} onClick={onClick} variant="outline">
      {name}
    </Button>
  );
}
