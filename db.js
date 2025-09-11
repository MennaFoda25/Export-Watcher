import sqlite3 from "sqlite3";
import { open } from "sqlite";
let db;

const initDB = async()=>{
  if (!db) {
    db = await open({
      filename: "./database.sqlite", 
      driver: sqlite3.Database,
    });


  await db.exec(`
      CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT CHECK(type IN ('invoice', 'receipt')) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      exported_at DATETIME,
      status TEXT CHECK(status IN ('new', 'moved', 'exported', 'not_exported', 'failed')) NOT NULL
    );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
  console.log("✅ Connected & ensured documents table exists");
  }
  return db;
};

export default initDB;







