"use client";

import { useStacks } from "@/hooks/use-stacks";
import { redirect } from "next/navigation";

export default function Home() {
  const { connected, addresses } = useStacks();

  // If connected, redirect to their main Stacks address page
  if (connected && addresses && addresses[0]) {
    redirect(`/${addresses[0]}`);
  }

  // If not connected, show landing screen
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-24 text-center">
      <h1 className="text-3xl font-bold">Stacks Account History</h1>
      <p className="text-gray-400">
        Connect your wallet or search for an address to view transactions.
      </p>
    </main>
  );
}
