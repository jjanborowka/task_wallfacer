import express, { Request, Response } from "express";
import { pool } from "./db/db";
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", async (req: Request, res: Response) => {
    try {
        const result = await pool.query("SELECT * from users"); // Example query
        res.json({ message: "Database connected!", time: result.rows[0] });
      } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).json({ error: "Database connection failed" });
      }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
