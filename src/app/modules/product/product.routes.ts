import express from "express";
import { ROLES_MANAGE_PRODUCTS, ROLES_VIEW_PRODUCTS } from "../../../constant";
import { fileUploader } from "../../../helpers/fileUploader";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { productController } from "./product.controller";
import { ProductValidation } from "./product.validation";

const router = express.Router();

router.get(
  "/",
  auth({ roles: ROLES_VIEW_PRODUCTS }),
  productController.getAllProducts,
);

router.get(
  "/categories",
  auth({ roles: ROLES_VIEW_PRODUCTS }),
  productController.getProductCategories,
);

router.get(
  "/:id",
  auth({ roles: ROLES_VIEW_PRODUCTS }),
  productController.getProductById,
);

router.post(
  "/",
  auth({ roles: ROLES_MANAGE_PRODUCTS }),
  fileUploader.uploadSingleImage,
  validateRequest({
    schema: ProductValidation.createProductValidationSchema,
    dataType: "formData",
  }),
  productController.createProduct,
);

router.put(
  "/:id",
  auth({ roles: ROLES_MANAGE_PRODUCTS }),
  fileUploader.uploadSingleImage,
  validateRequest({
    schema: ProductValidation.updateProductValidationSchema,
    dataType: "formData",
  }),
  productController.updateProduct,
);

router.delete(
  "/:id",
  auth({ roles: ROLES_MANAGE_PRODUCTS }),
  productController.deleteProduct,
);

export const productRoutes = router;
