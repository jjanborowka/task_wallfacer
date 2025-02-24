import { createPublicClient, webSocket, parseAbi, fromBlobs, GetLogsReturnType } from "viem";
import { mainnet } from "viem/chains";
import {depositAbi,windrowAbi} from './abi'
import type {LogEntry} from './types'
import {insertData,isTableEmpty} from './db/insert'
const INFURA_PROJECT_ID = process.env.METAMASK_API_KEY;
const INFURA_URL = `wss://base-mainnet.infura.io/ws/v3/${INFURA_PROJECT_ID}`;

// ✅ Create Viem Client (Using WebSockets)
const client = createPublicClient({
  chain: mainnet,
  transport: webSocket(INFURA_URL),
});


// ✅ Contract Address (Replace with your actual vault contract address)
const vaultAddress = process.env.ADDRESS as  `0x${string}`;


client.watchEvent({
  address: vaultAddress,
  event: depositAbi,
  onLogs: (logs) => {
    for (const log of logs) {
      console.log(Date());
      console.log(log);
      insertData(<LogEntry>log, false);
    }
  },
}
)
client.watchEvent({
  address: vaultAddress,
  event: windrowAbi,
  onLogs: (logs) => {
    for (const log of logs) {
      console.log(Date());
      console.log(log);
      insertData(<LogEntry>log, false);
    }
  },
}
)



async function main() {
  if (await isTableEmpty("row_input_table")===true){
  const result_d = await client.getLogs({
    address: vaultAddress,
    event: depositAbi,
    fromBlock:BigInt(25661786),
  }
  
  )
  for (const log of result_d) {
    insertData(<LogEntry>log, true);
  }
  const result_w = await client.getLogs({
    address: vaultAddress,
    event: windrowAbi,
    fromBlock:BigInt(25661786),
  }
  
  )
  for (const log of result_w) {
    insertData(<LogEntry>log, true);
  }
}
}

main()
