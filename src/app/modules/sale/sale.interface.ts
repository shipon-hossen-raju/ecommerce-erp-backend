import { Types } from "mongoose";

export interface ISaleItem {
  product: Types.ObjectId;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ISale {
  _id: Types.ObjectId;
  items: ISaleItem[];
  grandTotal: number;
  soldBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
