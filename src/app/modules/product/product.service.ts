import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import { fileUploader } from "../../../helpers/fileUploader";
import QueryBuilder from "../../builder/QueryBuilder";
import { LOW_STOCK_THRESHOLD, PRODUCT_SEARCHABLE_FIELDS } from "./product.constant";
import { IProduct } from "./product.interface";
import { Product } from "./product.model";

type TCreateProductPayload = Omit<
  IProduct,
  "_id" | "image" | "createdAt" | "updatedAt"
>;

// Create a product with a unique SKU and upload its image to Cloudinary
const createProduct = async (
  payload: TCreateProductPayload,
  file: Express.Multer.File,
) => {
  const existingSku = await Product.findOne({ sku: payload.sku });
  if (existingSku) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `Product with SKU '${payload.sku}' already exists`,
    );
  }

  const uploaded = await fileUploader.uploadToCloudinary(file);
  const image = uploaded.secure_url;

  return Product.create({ ...payload, image });
};

// List products with search/filter/sort/pagination and optional low-stock filter
const getAllProducts = async (query: Record<string, unknown>) => {
  const { lowStock, ...restQuery } = query;

  const productQuery = new QueryBuilder(Product.find(), restQuery)
    .search(PRODUCT_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  if (lowStock === "true") {
    productQuery.modelQuery = productQuery.modelQuery.find({
      stockQuantity: { $lt: LOW_STOCK_THRESHOLD },
    });
  }

  const data = await productQuery.execute();
  const meta = await productQuery.countTotal();

  return { data, meta };
};

// Get distinct, sorted list of product categories
const getProductCategories = async () => {
  const categories = await Product.distinct("category");
  return categories.filter(Boolean).sort();
};

// Fetch a single product by id
const getProductById = async (id: string) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }
  return product;
};

type TUpdateProductPayload = Partial<TCreateProductPayload>;

// Update a product; replaces the image on Cloudinary if a new file is given
const updateProduct = async (
  id: string,
  payload: TUpdateProductPayload,
  file?: Express.Multer.File,
) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  if (payload.sku && payload.sku !== product.sku) {
    const existingSku = await Product.findOne({ sku: payload.sku });
    if (existingSku) {
      throw new ApiError(
        httpStatus.CONFLICT,
        `Product with SKU '${payload.sku}' already exists`,
      );
    }
  }

  Object.assign(product, payload);
  if (file) {
    // remove image
    if (product.image) {
      await fileUploader.removeFromCloudinary(product.image);
    }

    const uploaded = await fileUploader.uploadToCloudinary(file);
    product.image = uploaded.secure_url;
  }

  await product.save();
  return product;
};

// Delete a product and remove its image from Cloudinary
const deleteProduct = async (id: string) => {
  const findProduct = await Product.findById(id);

  if (!findProduct) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  // remove image
  if (findProduct.image) {
    await fileUploader.removeFromCloudinary(findProduct.image);
  }

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }
  return null;
};

export const productService = {
  createProduct,
  getAllProducts,
  getProductCategories,
  getProductById,
  updateProduct,
  deleteProduct,
};
