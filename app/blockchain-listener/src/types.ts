export interface LogEntry {
    address: string; // Address as a string
    blockHash: string; // Block hash as a string
    blockNumber: bigint; // Block number as a bigint (for large integers)
    data: string; // Data as a string
    logIndex: number; // Log index as a number
    removed: boolean; // Removed flag as a boolean
    topics: string[]; // Topics as an array of strings
    transactionHash: string; // Transaction hash as a string
    transactionIndex: number; // Transaction index as a number
    args: {
        sender: string | undefined; // Allow sender to be a string or undefined
        owner: string | undefined;// Owner address as a string
        assets: bigint; // Assets as a bigint
        shares: bigint; // Shares as a bigint
        receiver?:string
    };
    eventName: string; // Event name as a string
}

