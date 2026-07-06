import { Types } from "mongoose";

export interface IProduct {
  _id: Types.ObjectId;
  name: string;
  sku: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}
