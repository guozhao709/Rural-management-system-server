import express from "express";
import db from "../db/index.js";
import { normalizeCropName } from "../tools/userAgrDic.js";
import { getAgriculture } from "../tools/userAgriculture.js";

const router = express.Router();

router.get("/info/:crop", async (req, res) => {
  const { crop } = req.params;

  const data = await getAgriculture(crop);

  res.json({
    code: 200,
    success: true,
    message: "获取成功",
    data: data ?? {},
  });
});

// 点击选择按钮时触发, 从数据库中获取该作物的详细信息
router.get("/info/db/:crop", async (req, res) => {
  const { crop } = req.params;
  const cropName = normalizeCropName(crop);

  const analysisTable = db
    .prepare(
      `
      SELECT analysis_text, updated_at
      FROM crop_analysis
      WHERE crop_name = ?
      ORDER BY updated_at DESC
      LIMIT 1
      `,
    )
    .get(cropName);

  const analysis = {
    text: analysisTable?.analysis_text,
    analysisTime: analysisTable?.updated_at,
  };

  res.json({
    code: 200,
    success: true,
    message: "获取成功",
    data: { cropName, analysis } ?? {},
  });
});

export default router;
