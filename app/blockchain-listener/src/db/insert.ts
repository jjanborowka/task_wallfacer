import {pool} from './db'
import {LogEntry} from '../types'
import { formatUnits } from 'viem';
export async function insertData(log:LogEntry) {
    try {
        // Prepare the SQL insert statement
        const insertQuery = `
            INSERT INTO row_input_table (EVENT_TYPE,EVENT_SENDER,EVENT_RECEIVER,EVENT_OWNER,EVENT_ASSETS,EVENT_SHARES,BLOCK_NUMBER,TRANSACTION_HASH)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8);
        `;
        const valueList = [
            log.eventName,
            log.args.sender,
            log.args.receiver !== undefined ? log.args.receiver : null,
            log.args.owner,
            formatUnits(log.args.assets,6),
            formatUnits(log.args.shares,6),
            log.blockNumber,
            log.transactionHash

        ] 
        // Execute the insert query
        const result = await pool.query(insertQuery, valueList);

        console.log('Insert successful:', result.rowCount); // Log the number of affected rows
    } catch (err) {
        console.error('Error inserting data:', err);
    }
}
  