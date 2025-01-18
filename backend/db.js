import pkg from "pg";
const {Pool} = pkg;
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.NODE_ENV === "production" ? process.env.POSTGRES_URL : process.env.DEV_POSTGRES_URL;

export const db = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: true,
    ca: Buffer.from(process.env.SUPABASE_CA_CERT, 'base64').toString()
  },
});

db.on("error", (err)=> {
  console.log("Database connection failed", err)
})