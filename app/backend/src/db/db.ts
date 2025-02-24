import { Pool, Client } from "pg";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();
console.log(process.env.DB_HOST)
console.log(process.env.DB_USER)
// For queries 
export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.on("connect", () => {
  console.log("Connected to the PostgreSQL database");
});
// For listing to live events
export const dbClient = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
// Connect to the database
dbClient.connect().then(() => {
  console.log("Connected to PostgreSQL");
  dbClient.query("LISTEN table_update");
});

// Listen for PostgreSQL NOTIFY messages
dbClient.on("notification", (msg) => {
  console.log("DB Update:", msg.payload);
});


