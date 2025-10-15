"use client";

import {
  fetchAddressTransactions,
  type FetchAddressTransactionsResponse,
} from "@/lib/fetch-address-transactions";
import { TransactionDetail } from "./txn-details";
import { useState } from "react";

interface TransactionsListProps {
  address: string;
  transactions: FetchAddressTransactionsResponse;
}

export function TransactionsList({
  address,
  transactions,
}: TransactionsListProps) {
  const [allTxns, setAllTxns] = useState<FetchAddressTransactionsResponse>(transactions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load another 20 txns
  async function loadMoreTxns() {
    try {
      setLoading(true);
      setError(null);

      // Compute next offset safely
      const nextOffset = (allTxns.offset ?? 0) + (allTxns.limit ?? 20);

      const newTxns = await fetchAddressTransactions({
        address,
        offset: nextOffset,
        limit: allTxns.limit ?? 20,
      });

      // Merge old + new results
      setAllTxns({
        ...newTxns,
        results: [...allTxns.results, ...newTxns.results],
      });
    } catch (err) {
      console.error("Failed to load more transactions:", err);
      setError("Unable to load more transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col border rounded-md divide-y border-gray-800 divide-gray-800">
        {allTxns.results.length > 0 ? (
          allTxns.results.map((tx) => (
            <div key={tx.tx.tx_id}>
              <TransactionDetail result={tx} />
            </div>
          ))
        ) : (
          <div className="text-center p-6 text-gray-400">
            No transactions found for this address.
          </div>
        )}
      </div>

      {error && <div className="text-red-400 text-center">{error}</div>}

      <button
        type="button"
        disabled={loading}
        onClick={loadMoreTxns}
        className={`px-4 py-2 rounded-lg w-fit border border-gray-800 mx-auto text-center transition-all ${
          loading ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-900"
        }`}
      >
        {loading ? "Loading..." : "Load More"}
      </button>
    </div>
  );
}
