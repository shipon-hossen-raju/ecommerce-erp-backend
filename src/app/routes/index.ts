import express from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { userRoutes } from "../modules/user/user.routes";
import { productRoutes } from "../modules/product/product.routes";
import { saleRoutes } from "../modules/sale/sale.routes";
import { dashboardRoutes } from "../modules/dashboard/dashboard.routes";

const router = express.Router();

const moduleRoutes = [
  { path: "/auth", route: authRoutes },
  { path: "/users", route: userRoutes },
  { path: "/products", route: productRoutes },
  { path: "/sales", route: saleRoutes },
  { path: "/dashboard", route: dashboardRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
