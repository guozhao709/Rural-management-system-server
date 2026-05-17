import express from "express";
import {getAgriculture} from "../../tools/userAgriculture.js";

const router = express.Router();

router.get('/info/:crop', async (req, res) => {

    const { crop } = req.params;
    const text = await getAgriculture(crop);

    res.json({
        code: 200,
        success: true,
        message: "获取成功",
        data: {text},
    })
})


export default router;