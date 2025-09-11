import sqlite3 from "sqlite3";
import { open } from "sqlite";
let db;

const initDB = async()=>{
  if (!db) {
    db = await open({
      filename: "./database.sqlite", // SQLite file will be created automatically
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







// const sql3 = sqlite3.verbose()

// const DB = new sql3.Database('./data.db', sqlite3.OPEN_READWRITE,connected)

// function connected(err){
//   if(err){
//   console.log(err.message)
//   return
//   }
//   console.log("Connected to the database")
// }


// let sql = `CREATE TABLE IF NOT EXISTS users(
// id INTEGER PRIMARY KEY,
// name TEXT NOT NULL
// )`


// DB.run(sql,[],(err)=>{
//   if(err){
//     console.log('Error creating the table')
//     return
//   }
//   console.log('Table created, YAAY')
// })

// export {DB};

// const db = new Database('data.db')

// // create table if not exists
// db.prepare(`
//   CREATE TABLE IF NOT EXISTS documents (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     type TEXT CHECK(type IN ('invoice','receipt')) NOT NULL,
//     created_at DATETIME NOT NULL,
//     exported_at DATETIME,
//     status TEXT CHECK(status IN ('new','moved','exported','not_exported','failed')) NOT NULL
//   )
// `).run();

// module.exports = db;