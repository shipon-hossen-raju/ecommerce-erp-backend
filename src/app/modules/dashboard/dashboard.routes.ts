import express from "express";
import { ROLES_VIEW_DASHBOARD } from "../../../constant";
import auth from "../../middlewares/auth";
import { dashboardController } from "./dashboard.controller";

const router = express.Router();

router.get("/", auth({}), dashboardController.getStats);
router.get(
  "/sales-trend",
  auth({ roles: ["ADMIN", "MANAGER"] }),
  dashboardController.getSalesTrend,
);
router.get(
  "/top-products",
  auth({ roles: ["ADMIN", "MANAGER"] }),
  dashboardController.getTopProducts,
);

export const dashboardRoutes = router;
