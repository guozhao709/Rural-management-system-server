import db from "../db/index.js";

const createUsersDB = () => {
  // 创建用户表
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone TEXT UNIQUE NOT NULL,     
  password TEXT NOT NULL,         
  name TEXT,
  gender INTEGER DEFAULT 0,        
  birthday DATE,                   
  address TEXT,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP
)`,
  ).run();

  // 创建农作物表
  db.prepare(
    `
CREATE TABLE IF NOT EXISTS crop_analysis (
id INTEGER PRIMARY KEY AUTOINCREMENT,

crop_name TEXT NOT NULL,

region TEXT NOT NULL,

analysis_text TEXT NOT NULL,

created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

UNIQUE(crop_name, region)
)
`,
  ).run();
};

export default createUsersDB;
