import { LOW_STOCK_THRESHOLD } from "../product/product.constant";
import { Product } from "../product/product.model";
import { Sale } from "../sale/sale.model";

const getStats = async () => {
  const [totalProducts, totalSales, lowStockProducts] = await Promise.all([
    Product.countDocuments(),
    Sale.countDocuments(),
    Product.find({ stockQuantity: { $lt: LOW_STOCK_THRESHOLD } }).sort(
      "stockQuantity",
    ),
  ]);

  return {
    totalProducts,
    totalSales,
    lowStockCount: lowStockProducts.length,
    lowStockProducts,
  };
};

export const dashboardService = {
  getStats,
};
