import express from "express";

import { readAdmin } from "../../../utils/adminStorage.js";
import { writeAllAdmin } from "../../../utils/adminStorage.js";

const router = express.Router();

// 返回管理员的全部信息
router.get("/lists", async (req, res) => {
  const adminArr = await readAdmin();
  res.json({
    code: 200,
    success: true,
    message: "获取成功",
    data: adminArr,
  });
});

// 删除管理员
router.delete("/:id", async (req, res) => {
  console.log(req.params);
  
  const { id } = req.params;
  const adminArr = await readAdmin();
  const index = adminArr.findIndex((item) => item.adminID === id);

  if (index === -1) {
    return res.status(404).json({
      code: 404,
      success: false,
      message: "管理员不存在",
      data: null,
    });
  }

  adminArr.splice(index, 1);
  await writeAllAdmin(adminArr);
  res.json({
    code: 200,
    success: true,
    message: "删除成功",
    data: null,
  });
});

// 更新管理员
router.put("/:id", async (req, res) => {
  console.log(req.body);

  const { adminID, adminname, password, phone, role } = req.body;
  const adminArr = await readAdmin();
  const index = adminArr.findIndex((item) => item.adminID === adminID);

  if (index === -1) {
    return res.status(404).json({
      code: 404,
      success: false,
      message: "管理员不存在",
      data: null,
    });
  }

  adminArr[index].adminname = adminname;
  adminArr[index].password = password;
  adminArr[index].phone = phone;
  adminArr[index].role = role;

  await writeAllAdmin(adminArr);
  res.json({
    code: 200,
    success: true,
    message: "更新成功",
    data: null,
  });
});

export default router;
