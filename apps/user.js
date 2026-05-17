import userAuthRoutes from "../routes/client/userAuth.js";
import { authMiddleware } from "../tools/userJwt.js";
import userAIchatRoutes from "../routes/client/userAIchatWeb.js";
import userAgricultureRoutes from "../routes/client/userAgriculture.js";

const userRouter = (app) => {
  // 用户注册和登录路由
  app.use("/api/v1/user/auth", userAuthRoutes);

  // 用户AI聊天路由
  app.use("/api/v1/user/aichat", authMiddleware, userAIchatRoutes);

  app.use("/api/v1/user/argiculture", userAgricultureRoutes);
};



export default userRouter;
