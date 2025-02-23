import { createPublicClient, webSocket, parseAbi, fromBlobs } from "viem";
import { mainnet } from "viem/chains";
import {depositAbi,windrowAbi} from './abi'
import {formatLogArgs} from './helper_functions'
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
    formatLogArgs(log)
  }),
}
)
client.watchEvent({
  address: vaultAddress,
  event: windrowAbi,
  onLogs: (logs: any[]) => logs.forEach((log) => {
    formatLogArgs(log)
  }),
}
)



async function main() {
  const result = await client.getLogs({
    address: vaultAddress,
    event: depositAbi,
    fromBlock:BigInt(26772530),
    toBlock:BigInt(26772530)
  }
  
  )
  console.log("test")
  console.log(result)
  result.forEach((log) =>{
    formatLogArgs(log)
  })
}
main()

