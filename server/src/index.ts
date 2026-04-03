import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import categoryRoutes from "./routes/category.route.js";
import productRoutes from "./routes/product.route.js";
import bannerRoutes from "./routes/banner.route.js";

import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();
dotenv.config();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use('/api/v1/categories', categoryRoutes)
app.use("/api/v1/products",productRoutes)
app.use("/api/v1/banners",bannerRoutes);

app.use(errorMiddleware);
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
