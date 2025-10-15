export function abbreviateAddress(address: string) {
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
}

export function abbreviateTxId(txId: string) {
    return `${txId.substring(0, 4)}...${txId.substring(txId.length - 4)}`;
}