import {pool} from './db'
import {LogEntry} from '../types'
import { formatUnits } from 'viem';
import {getRandomDate} from '../helper_functions'
export async function insertData(log:LogEntry,historical:boolean) {
    try {
        // Prepare the SQL insert statement
        let insertQuery = `
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
        // To fill data for demonstration
        // I am aware that it is possible to read this data via getBlock API,  
        // but that will add no value in this example.

        if(historical){
            insertQuery = `
            INSERT INTO row_input_table (EVENT_TYPE,EVENT_SENDER,EVENT_RECEIVER,EVENT_OWNER,EVENT_ASSETS,EVENT_SHARES,BLOCK_NUMBER,TRANSACTION_HASH,TIME_STAMP)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9);
        `;
        const start = new Date('2022-01-01T00:00:00Z');
        const end = new Date();
        valueList.push(getRandomDate(start,end).toISOString())
        }

        // Execute the insert query
        const result = await pool.query(insertQuery, valueList);

        console.log('Insert successful:', result.rowCount); 
    } catch (err) {
        console.error('Error inserting data:', err);
    }
}
  

export async function isTableEmpty(tableName: string): Promise<boolean> {
    try {
      const result = await pool.query(`SELECT EXISTS (SELECT 1 FROM ${tableName} LIMIT 1) AS empty`);
      return !result.rows[0].empty; 
    } catch (error) {
      console.error('Error checking table:', error);
      throw error;
    }
  }