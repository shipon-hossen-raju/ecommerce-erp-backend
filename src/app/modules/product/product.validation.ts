import { z } from "zod";

const createProductValidationSchema = z.object({
  name: z
    .string({ required_error: "Product name is required" })
    .min(1, "Product name is required"),
  sku: z.string({ required_error: "SKU is required" }).min(1, "SKU is required"),
  category: z
    .string({ required_error: "Category is required" })
    .min(1, "Category is required"),
  purchasePrice: z.coerce
    .number({ required_error: "Purchase price is required" })
    .min(0, "Purchase price cannot be negative"),
  sellingPrice: z.coerce
    .number({ required_error: "Selling price is required" })
    .min(0, "Selling price cannot be negative"),
  stockQuantity: z.coerce
    .number()
    .min(0, "Stock quantity cannot be negative")
    .default(0),
});

const updateProductValidationSchema = z.object({
  name: z.string().min(1).optional(),
  sku: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  purchasePrice: z.coerce.number().min(0).optional(),
  sellingPrice: z.coerce.number().min(0).optional(),
  stockQuantity: z.coerce.number().min(0).optional(),
});

export const ProductValidation = {
  createProductValidationSchema,
  updateProductValidationSchema,
};
