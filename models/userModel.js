import sqlite3 from "sqlite3";
import { open } from "sqlite";

// open a connection (singleton pattern recommended in real apps)
const dbPromise = open({
  filename: "./data.db",
  driver: sqlite3.Database,
});

export async function getUserById(id) {
  const db = await dbPromise;
  return db.get("SELECT * FROM users WHERE id = ?", [id]);
}
