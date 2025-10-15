export function abbreviateAddress(address: unknown): string {
  if (typeof address !== "string" || address.length < 8) {
    return "Invalid Addr";
  }
  return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
}

export function abbreviateTxnId(txId: unknown): string {
  if (typeof txId !== "string" || txId.length < 10) {
    return "Invalid Txn";
  }
  return `${txId.substring(0, 6)}...${txId.substring(txId.length - 6)}`;
}
