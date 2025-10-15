// input to our function

interface FetchAddressTransactionsArgs {
    address: string;
    offset?: number;
}

// output from our function
export interface FetchAddressTransactionsResponse {
    limit: number;
    offset: number;
    total: number;
    results: Array<{
        tx: Transaction;
        stx_sent: string;
        stx_received: string;
        events: {
            stx: TransactionEvent;
            ft: TransactionEvent;
            nft: TransactionEvent;
        }
    }>;
}

// Intermediary types of transactions we get from Hiro's APIs
interface BaseTransaction {
    tx_id: string;
    nonce: number;
    sender_address: string;
    block_hash: string;
    parent_block_hash: string;
    block_height: number;
    burn_block_time: number;
    tx_status: string;
    ttx_type:
    | "coinbase"
    | "token_transfer"
    | "smart_contract"
    | "contract_call"
    | "poison_microblock";
}

interface coinbaseTransaction extends BaseTransaction {
    tx_type: "coinbase";
}

interface tokenTransferTransaction extends BaseTransaction {
    tx_type: "token_transfer";
    token_transfer: {
        recipient_address: string;
        amount: string;
    }
}

interface smartContractTransaction extends BaseTransaction {
    tx_type: "smart_contract";
    smart_contract: {
        clarity_version: number;
        contract_id: string;
    }
}

interface contractCallTransaction extends BaseTransaction {
    tx_type: "contract_call";
    contract_call: {
        contract_id: string;
        function_name: string;
    }
}

interface poisonMicroblockTransaction extends BaseTransaction {
    tx_type: "poison_microblock";
}

export type Transaction = coinbaseTransaction | tokenTransferTransaction | smartContractTransaction | contractCallTransaction | poisonMicroblockTransaction;

interface TransactionEvent {
    transfer: number;
    mint: number;
    burn: number;
}


export async function fetchAddressTransaction({ address, offset = 0,}: FetchAddressTransactionsArgs): Promise<FetchAddressTransactionsResponse> {
    const url = `https://api.hiro.so/extended/v2/addresses/${address}/transactions?limit=20&offset=${offset}`;
    const response = await fetch(url);

    // if (response.status !== 200) {
    //     throw new Error(`Error fetching transactions: ${response.statusText}`);
    // }

    if (!response.ok) {
        throw new Error(`Error fetching transactions: ${response.statusText}`);
    }

    const data = await response.json();
    return data as FetchAddressTransactionsResponse;
}