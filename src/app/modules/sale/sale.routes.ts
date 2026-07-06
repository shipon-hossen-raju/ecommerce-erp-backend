import express from "express";
import { ROLES_CREATE_SALES, ROLES_VIEW_SALES } from "../../../constant";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { saleController } from "./sale.controller";
import { SaleValidation } from "./sale.validation";

const router = express.Router();

router.post(
  "/",
  auth({ roles: ROLES_CREATE_SALES }),
  validateRequest({ schema: SaleValidation.createSaleValidationSchema }),
  saleController.createSale,
);

router.get("/", auth({ roles: ROLES_VIEW_SALES }), saleController.getAllSales);

export const saleRoutes = router;
