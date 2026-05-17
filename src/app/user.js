import userAuthRoutes from "../client/routes/userAuth.js";
import { authMiddleware } from "../client/tools/userJwt.js";
import userAIchatRoutes from "../client/routes/userAIchatWeb.js";
import userAgricultureRoutes from "../client/routes/userAgriculture.js";

const userRouter = (app) => {
  // 用户注册和登录路由
  app.use("/api/v1/user/auth", userAuthRoutes);

  // 用户AI聊天路由
  app.use("/api/v1/user/aichat", authMiddleware, userAIchatRoutes);

  app.use("/api/v1/user/argiculture", userAgricultureRoutes);
};



export default userRouter;
