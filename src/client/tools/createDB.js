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

//   // 2. 批量插入 100 条村民测试数据
// const insertTestVillagers = () => {
//   // 开启事务（批量插入，速度极快）
//   const transaction = db.transaction(() => {
//     // 插入语句
//     const stmt = db.prepare(`
//       INSERT INTO users 
//       (phone, password, name, gender, birthday, address) 
//       VALUES (?, ?, ?, ?, ?, ?)
//     `);

//     // 循环生成 100 条数据
//     for (let i = 1; i <= 100; i++) {
//       // 手机号：唯一不重复
//       const phone = `1380000${String(i).padStart(4, "0")}`;
//       // 统一密码：方便测试登录
//       const password = "123456";
//       // 姓名：村民1 ~ 村民100
//       const name = `村民${i}`;
//       // 性别：随机 0(女)/1(男)
//       const gender = i % 2;
//       // 随机生日（1980-2000年）
//       const birthday = `19${80 + (i % 20)}-${String((i % 12) + 1).padStart(2, "0")}-01`;
//       // 🔥 严格按你的要求：中南租1号、中南租2号...中南租100号
//       const address = `中南租${i}号`;

//       // 执行插入
//       stmt.run(phone, password, name, gender, birthday, address);
//     }
//   });

//   // 运行事务
//   transaction();
//   console.log("✅ 100条村民测试数据插入成功！");
// };

// // 3. 执行插入（执行一次即可，重复执行会报手机号重复错误）
// insertTestVillagers();
};

export default createUsersDB;
