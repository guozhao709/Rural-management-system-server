import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_DIR = path.resolve(__dirname, "../../../data/client");
const DB_FILE = path.join(DB_DIR, "village.db");

fs.mkdirSync(DB_DIR, { recursive: true });
const db = new Database(DB_FILE);
export default db;
