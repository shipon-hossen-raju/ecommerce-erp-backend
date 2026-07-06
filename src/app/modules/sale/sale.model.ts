import { Schema, model } from "mongoose";
import { ISale, ISaleItem } from "./sale.interface";

const saleItemSchema = new Schema<ISaleItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const saleSchema = new Schema<ISale>(
  {
    items: {
      type: [saleItemSchema],
      required: true,
      validate: {
        validator: (items: ISaleItem[]) => items.length > 0,
        message: "A sale must contain at least one item",
      },
    },
    grandTotal: { type: Number, required: true, min: 0 },
    soldBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export const Sale = model<ISale>("Sale", saleSchema);
