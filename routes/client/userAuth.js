import express from "express";
import { userRegister, userLogin } from "../../tools/userStorage.js";
import { getUserToken } from "../../tools/userJwt.js";
import {authMiddleware} from "../../tools/userJwt.js"



const router = express.Router();

// 注册接口
router.post("/register", (req, res) => {
    const user = req.body;
    const backData = userRegister(user);
    if(backData.success){
        res.json({
            success: true,
            message: "注册成功",
        });
    }else{
        res.json({
            success: false,
            message: backData.message,
        });
    }
});

// 登录接口
router.post("/login", (req, res) => {
    
    const loginInfo = req.body;
    console.log('loginInfo', loginInfo);
    
    const backData = userLogin(loginInfo);
    if(backData.success){

        // 生成token
        const token = getUserToken(loginInfo);
        if(!token){
            return res.status(500).json({
                success: false,
                message: "生成token失败",
            });
        }

        res.json({
            success: true,
            message: "登录成功",
            token,
            userInfo: backData.user,
        });
    }else{
        res.json({
            success: false,
            message: backData.message,
        });
    }
});

// 判断token是否有效
router.get("/checkToken", authMiddleware ,(req, res) => {
    // token有效, token如果无效, 在中间件进行处理
    res.json({
        success: true,
        message: "token 有效",
    });
});

export default router;

