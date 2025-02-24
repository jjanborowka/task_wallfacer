import { createPublicClient, webSocket, parseAbi, fromBlobs, GetLogsReturnType } from "viem";
import { mainnet } from "viem/chains";
import {depositAbi,windrowAbi} from './abi'
import {LogEntry} from './types'
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
  onLogs: (logs: any[]) => logs.forEach((log) => {
    console.log(Date())
    console.log(log)
  }),
}
)
client.watchEvent({
  address: vaultAddress,
  event: windrowAbi,
  onLogs: (logs: any[]) => logs.forEach((log) => {
    console.log(Date())
    console.log(log)
  }),
}
)



async function main() {
  if (await isTableEmpty("row_input_table")==true){
  const result_d = await client.getLogs({
    address: vaultAddress,
    event: depositAbi,
    fromBlock:BigInt(25661786),
  }
  
  )
  result_d.forEach((log) =>{
    insertData(<LogEntry>log);
  })
  const result_w = await client.getLogs({
    address: vaultAddress,
    event: windrowAbi,
    fromBlock:BigInt(25661786),
  }
  
  )
  result_w.forEach((log) =>{
    insertData(<LogEntry>log);
  })
}
}

main()
