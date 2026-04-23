import authRoutes from "../routes/admin/auth.js";
import administratorRoutes from "../routes/admin/manage/administrator.js";
import villagerRoutes from "../routes/admin/manage/villagers.js";
import { authMiddleware } from "../utils/adminJWT.js";

const adminRouter = (app) => {
  // 管理员注册和登录路由
  app.use("/admin/auth", authRoutes);

  // 侧栏功能路由
  // 1. 管理员管理路由
  app.use("/admin/administrator", authMiddleware, administratorRoutes);
  // 2. 获取村民列表路由
  app.use("/admin/villagers", villagerRoutes);
};

export default adminRouter;
