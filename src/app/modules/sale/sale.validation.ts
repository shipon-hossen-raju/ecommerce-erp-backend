import { z } from "zod";

const createSaleValidationSchema = z.object({
  items: z
    .array(
      z.object({
        product: z.string({ required_error: "Product id is required" }),
        quantity: z.coerce
          .number({ required_error: "Quantity is required" })
          .int("Quantity must be a whole number")
          .min(1, "Quantity must be at least 1"),
      }),
    )
    .min(1, "A sale must contain at least one item"),
});

export const SaleValidation = {
  createSaleValidationSchema,
};
