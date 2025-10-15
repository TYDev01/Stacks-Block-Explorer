import type {
  FetchAddressTransactionsResponse,
  Transaction,
} from "@/lib/fetch-address-transactions";
import { abbreviateTxId, abbreviateAddress } from "@/lib/stx-utils";
import {
  ActivityIcon,
  ArrowLeftRightIcon,
  BlocksIcon,
  CodeSquareIcon,
  FunctionSquareIcon,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

interface TransactionDetailProps {
  result: FetchAddressTransactionsResponse["results"][number];
}

type TransactionInformationByType = {
  primaryTitle: string;
  secondaryTitle: string;
  tags: string[];
};

// Map all transaction types to icons (covering all possible tx_type values)
const TxTypeIcon: Record<Transaction["tx_type"], LucideIcon> = {
  coinbase: BlocksIcon,
  token_transfer: ArrowLeftRightIcon,
  smart_contract: CodeSquareIcon,
  contract_call: FunctionSquareIcon,
  poison_microblock: ActivityIcon,
};

// Safe utility for transaction info extraction
function getTransactionInformationByType(
  result: TransactionDetailProps["result"]
): TransactionInformationByType {
  const tx = result.tx;

  switch (tx.tx_type) {
    case "coinbase":
      return {
        primaryTitle: `Block #${tx.block_height}`,
        secondaryTitle: "",
        tags: ["Coinbase"],
      };

    case "token_transfer":
      return {
        primaryTitle: `Transfer ${(
          Number.parseFloat(tx.token_transfer.amount) / 1_000_000
        ).toFixed(2)} STX`,
        secondaryTitle: abbreviateAddress(tx.token_transfer.recipient_address),
        tags: ["Token Transfer"],
      };

    case "smart_contract":
      return {
        primaryTitle: tx.smart_contract.contract_id,
        secondaryTitle: "",
        tags: ["Contract Deployment"],
      };

    case "contract_call":
      return {
        primaryTitle: tx.contract_call.function_name,
        secondaryTitle: tx.contract_call.contract_id.split(".")[1] || "",
        tags: ["Contract Call"],
      };

    case "poison_microblock":
      return {
        primaryTitle: "Microblock",
        secondaryTitle: "",
        tags: ["Microblock"],
      };

    default:
      return {
        primaryTitle: "Unknown Transaction",
        secondaryTitle: "",
        tags: [],
      };
  }
}

export function TransactionDetail({ result }: TransactionDetailProps) {
  const Icon = TxTypeIcon[result.tx.tx_type];
  const { primaryTitle, secondaryTitle, tags } =
    getTransactionInformationByType(result);

  // Some transactions may not have block_time or nonce in pending states
  // Narrow the union at runtime so TypeScript knows block_time exists on this variant
  const blockTime =
    "block_time" in result.tx && typeof result.tx.block_time === "number"
      ? result.tx.block_time
      : undefined;

  const timestamp = blockTime
    ? new Date(blockTime * 1000).toLocaleTimeString() // multiplied by 1000 (Stacks API returns seconds)
    : "Pending";

  return (
    <div className="flex items-center p-4 border-l-2 border-transparent hover:border-blue-500 transition-all justify-between">
      {/* Left: Transaction info */}
      <div className="flex items-center gap-4">
        <Icon className="h-10 w-10 rounded-full p-2 border border-gray-700" />

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">{primaryTitle}</span>
            {secondaryTitle && (
              <span className="text-gray-500">({secondaryTitle})</span>
            )}
          </div>

          <div className="flex items-center gap-1 font-bold text-xs text-gray-500">
            {tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
            <span>•</span>
            <span className="font-normal">
              By{" "}
              <Link
                href={`/${result.tx.sender_address}`}
                className="hover:underline transition-all"
              >
                {abbreviateAddress(result.tx.sender_address)}
              </Link>
            </span>
          </div>
        </div>
      </div>

      {/* Right: Metadata */}
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <span>{abbreviateTxId(result.tx.tx_id)}</span>
          <span>•</span>
          <span suppressHydrationWarning>{timestamp}</span>
        </div>

        <div className="flex items-center gap-1 font-bold text-xs text-gray-500">
          <span>Block #{result.tx.block_height ?? "—"}</span>
          <span>•</span>
          <span>Nonce {result.tx.nonce ?? "—"}</span>
        </div>
      </div>
    </div>
  );
}
