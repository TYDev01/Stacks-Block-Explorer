import { useState, useEffect } from "react";
import { connect, disconnect, isConnected } from "@stacks/connect";

export function useStacks() {
  const [connected, setConnected] = useState(false);
  const [addresses, setAddresses] = useState<string[] | null>(null);

  async function connectWallet() {
    if (isConnected()) {
      console.log("Already authenticated");
      return;
    }

    const response = await connect();
    setAddresses(response.addresses);
    setConnected(true);
    console.log("Connected:", response.addresses);
  }

  function disconnectWallet() {
    disconnect();
    setConnected(false);
    setAddresses(null);
    console.log("User disconnected");
  }

  useEffect(() => {
    setConnected(isConnected());
  }, []);

  return { connected, addresses, connectWallet, disconnectWallet };
}
