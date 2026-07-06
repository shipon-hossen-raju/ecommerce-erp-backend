import httpStatus from "http-status";
import mongoose from "mongoose";
import ApiError from "../../../errors/ApiErrors";
import { Product } from "../product/product.model";
import { ISaleItem } from "./sale.interface";
import { Sale } from "./sale.model";
import { checkMongodbID } from "../../../utils/checkMongodbId";

type TSaleItemInput = { product: string; quantity: number };

const createSale = async ({
  items,
  soldBy,
}: {
  items: TSaleItemInput[];
  soldBy: string;
}) => {
  const session = await mongoose.startSession();

  try {
    const sale = await session.withTransaction(async () => {
      const saleItems: ISaleItem[] = [];

      for (const item of items) {
        const productId = checkMongodbID(item.product);
        const updatedProduct = await Product.findOneAndUpdate(
          { _id: productId, stockQuantity: { $gte: item.quantity } },
          { $inc: { stockQuantity: -item.quantity } },
          { new: true, session },
        );

        if (!updatedProduct) {
          const product = await Product.findById(productId).session(session);
          if (!product) {
            throw new ApiError(
              httpStatus.NOT_FOUND,
              `Product not found: ${item.product}`,
            );
          }
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            `Insufficient stock for '${product.name}'. Available: ${product.stockQuantity}, requested: ${item.quantity}`,
          );
        }

        const subtotal = Number(
          (updatedProduct.sellingPrice * item.quantity).toFixed(2),
        );

        saleItems.push({
          product: updatedProduct._id,
          productName: updatedProduct.name,
          quantity: item.quantity,
          unitPrice: updatedProduct.sellingPrice,
          subtotal,
        });
      }

      const grandTotal = saleItems.reduce(
        (sum, item) => sum + item.subtotal,
        0,
      );

      const [createdSale] = await Sale.create(
        [{ items: saleItems, grandTotal, soldBy }],
        { session },
      );
      return createdSale;
    });

    return sale;
  } finally {
    await session.endSession();
  }
};

const getAllSales = async () => {
  return Sale.find().populate("soldBy", "name email role").sort("-createdAt");
};

export const saleService = {
  createSale,
  getAllSales,
};
