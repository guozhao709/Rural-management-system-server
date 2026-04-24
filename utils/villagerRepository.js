import db from "../db/index.js";

// 获取村民列表
export const getVillagers = () => {
  const villagers = db.prepare(`SELECT * FROM users`).all();
  return villagers;
};

// 分页获取村民列表
export const getVillagersByPage = (page, pageSize) => {
  // 计算要跳过的数据量：第1页跳过0条，第2页跳过pageSize条...
  const offset = (page - 1) * pageSize;
  // SQLite 分页语法：LIMIT 条数 OFFSET 跳过的条数
  return db
    .prepare(
      `
    SELECT * FROM users 
    LIMIT ? OFFSET ?
  `,
    )
    .all(pageSize, offset);
};

// 获取村民总数
export const getVillagersCount = () => {
  return db.prepare(`SELECT COUNT(*) as total FROM users`).get().total;
};

// 根据id删除村民信息
export const deleteVillagerById = (id) => {
  // run() 执行 增/删/改 操作，返回受影响的行数
  console.log("删除的村民Id:", id);
  return db.prepare(`DELETE FROM users WHERE id = ?`).run(id);
};

// 根据ID更新村民信息
export const updateVillagerById = (id, updateData) => {
  const { name, phone, address, birthday, gender, password } = updateData; // 按需修改你的字段
  return db
    .prepare(
      `
    UPDATE users 
    SET name = ?, phone = ?, address = ?, birthday = ?, gender = ?, password = ? 
    WHERE id = ?
  `,
    )
    .run(name, phone, address, birthday, gender, password, id);
};
