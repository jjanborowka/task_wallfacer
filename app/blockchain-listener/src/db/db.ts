import dotenv from "dotenv";
import { Pool } from "pg";

// Load environment variables
dotenv.config();
console.log(process.env.DB_HOST);
console.log(process.env.DB_USER);

export const pool = new Pool({
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

pool.on("connect", async () => {
	console.log("Connected to the PostgreSQL database");
});

export default pool;
