import "dotenv/config";
import express from "express";
import adminRouter from "./app/admin.js";
import userRouter from "./app/user.js";
import cors from "cors";
import createUsersDB from "./client/tools/createDB.js";
const port = process.env.PORT || 3000;


// 创建用户表(如果有就跳过，没有就创建)
createUsersDB();

// 创建 express 应用
const app = express();

// 解决跨域问题
app.use(cors({
  origin:[
    'http://127.0.0.1:8080', // B端
    'http://127.0.0.1:8081' , // C端
    'http://127.0.0.1:5500'
  ], // 前端地址
  credentials: true, // 如果需要传递 cookie，必须开启
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 允许的请求方法
  allowedHeaders: ['Content-Type', 'Authorization'] // 允许的请求头
}))


// 用来解析 json文件
app.use(express.json())

// 管理员路由
adminRouter(app);
// 用户路由
userRouter(app);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
