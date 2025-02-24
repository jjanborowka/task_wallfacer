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
  

export async function isTableEmpty(tableName: string): Promise<boolean> {
    try {
      const result = await pool.query(`SELECT EXISTS (SELECT 1 FROM ${tableName} LIMIT 1) AS empty`);
      return !result.rows[0].empty; // If `empty` is false, table has data; otherwise, it's empty.
    } catch (error) {
      console.error('Error checking table:', error);
      throw error;
    }
  }