import express from "express";
import {
  getVillagers,
  getVillagersByPage,
  getVillagersCount,
  deleteVillagerById,
  updateVillagerById,
} from "../../../utils/villagerRepository.js";
const router = express.Router();

// 获取村民列表
router.get("/lists", (req, res) => {
  // 接收前端传的分页参数（默认：第1页，每页15条）
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 15;

  // 查询分页数据 + 总条数
  const list = getVillagersByPage(page, pageSize);
  const total = getVillagersCount();

  // 返回给前端：数据列表、总条数、当前页、每页条数
  res.json({
    code: 200,
    data: {
      list,
      total,
      page,
      pageSize,
    },
    msg: "获取成功",
  });
});

// 删除某个村民
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const result = deleteVillagerById(id);
  if (result.changes > 0) {
    res.json({ message: "OK" });
  } else {
    res.status(404).json({ message: "未找到该村民信息" });
  }
});
// 更新某个村民的信息
router.put("/:id", (req, res) => {
  const { id } = req.params;
  
  const { name, phone, address, birthday, gender, password } = req.body;
  const result = updateVillagerById(id, {
    name,
    phone,
    address,
    birthday,
    gender,
    password,
  });
  if (result.changes > 0) {
    res.json({ message: "OK" });
  } else {
    res.status(404).json({ message: "未找到该村民信息" });
  }
});
export default router;
