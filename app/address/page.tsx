import { TransactionsList } from "@/components/txns-list";
import { fetchAddressTransactions } from "@/lib/fetch-address-transactions";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

export default async function Activity({
  params,
}: {
  params: { address: string };
}) {
  // ✅ params is NOT a Promise
  const { address } = params;

  // ✅ Fetch the first 20 transactions for this address
  const initialTransactions = await fetchAddressTransactions({ address });

  return (
    <main className="flex min-h-screen flex-col p-8 gap-8">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold break-all">{address}</h1>

        <Link
          href={`https://explorer.hiro.so/address/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg flex items-center gap-1 bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <ExternalLinkIcon className="h-4 w-4" />
          View on Hiro
        </Link>
      </div>

      <TransactionsList address={address} transactions={initialTransactions} />
    </main>
  );
}
