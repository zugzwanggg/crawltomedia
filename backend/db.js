import pkg from "pg";
const {Pool} = pkg;
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.NODE_ENV === "production" ? process.env.POSTGRES_URL : process.env.DEV_POSTGRES_URL;

export const db = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: true
  },
});

db.on("error", (err)=> {
  console.log("Database connection failed", err)
})