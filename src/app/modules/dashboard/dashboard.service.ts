import { Types } from "mongoose";
import { LOW_STOCK_THRESHOLD } from "../product/product.constant";
import { Product } from "../product/product.model";
import { Sale } from "../sale/sale.model";
import { TUserRole } from "../user/user.interface";
import { User } from "../user/user.model";

const getStats = async (role: TUserRole, userId: string) => {
  const isEmployee = role === "EMPLOYEE";
  const isAdmin = role === "ADMIN";

  if (isEmployee) {
    const [mySalesCount, myEarningsAgg] = await Promise.all([
      Sale.countDocuments({ soldBy: userId }),
      Sale.aggregate([
        { $match: { soldBy: new Types.ObjectId(userId) } },
        { $group: { _id: null, total: { $sum: "$grandTotal" } } },
      ]),
    ]);

    return {
      mySalesCount,
      myEarnings: myEarningsAgg[0]?.total ?? 0,
    };
  }

  const [totalProducts, totalSales, lowStockProducts, totalUsers] =
    await Promise.all([
      Product.countDocuments(),
      Sale.countDocuments(),
      Product.find({ stockQuantity: { $lt: LOW_STOCK_THRESHOLD } }).sort(
        "stockQuantity",
      ),
      ...(isAdmin ? [User.countDocuments({})] : []),
    ]);

  return {
    totalProducts,
    totalSales,
    lowStockCount: lowStockProducts.length,
    lowStockProducts,
    ...(isAdmin ? { totalUsers } : {}),
  };
};

export const dashboardService = {
  getStats,
};
