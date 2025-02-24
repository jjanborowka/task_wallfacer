import { FastifyInstance } from "fastify";
import {pool} from './db/db'
export async function analyticsRouts(fastify: FastifyInstance) {
  fastify.get("/analytics/weekday/:event_type", async (request, reply) => {
    const { event_type } = request.params as { event_type: string };
    const { from, to } = request.query as { from?: string; to?: string };
    // Avg sum, and amount of events per given day of the week 
    try{
    let query = `
            SELECT sum(ft.EVENT_ASSETS),count(ft.EVENT_ASSETS),dd.day_of_week FROM FACT_TABLE as ft LEFT JOIN date_dimension as dd on ft.DATE_ID = dd.DATE_ID
            where EVENT_TYPE = $1
        `;
    const values = [ 
        event_type
    ]
    if (from){
        query += ` AND TIME_STAMP >= ${from}`
    }
    if (to){
        query += ` AND TIME_STAMP <= ${to}`
    }
    query += " GROUP BY day_of_week;"
    console.log(query)
    const result = await pool.query(query, values);
    return {"data":result}
}
catch (err) {
    console.error('Error inserting data:', err);
}

  });

  
}

export default analyticsRouts;
