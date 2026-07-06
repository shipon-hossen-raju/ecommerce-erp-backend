import express from "express";
import { ROLES_VIEW_DASHBOARD } from "../../../constant";
import auth from "../../middlewares/auth";
import { dashboardController } from "./dashboard.controller";

const router = express.Router();

router.get(
  "/",
  auth({ roles: ROLES_VIEW_DASHBOARD }),
  dashboardController.getStats,
);

export const dashboardRoutes = router;
