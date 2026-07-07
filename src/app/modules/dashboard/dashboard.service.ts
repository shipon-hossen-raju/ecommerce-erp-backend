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

const getSalesTrend = async (days: number) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));

  const trend = await Sale.aggregate([
    { $match: { createdAt: { $gte: start } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        totalAmount: { $sum: "$grandTotal" },
        count: { $sum: 1 },
      },
    },
  ]);

  const trendByDate = new Map(
    trend.map((t) => [t._id, { totalAmount: t.totalAmount, count: t.count }]),
  );

  const result = [];
  for (let i = 0; i < days; i += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const dateKey = date.toISOString().slice(0, 10);
    const entry = trendByDate.get(dateKey);
    result.push({
      date: dateKey,
      totalAmount: entry?.totalAmount ?? 0,
      count: entry?.count ?? 0,
    });
  }

  return result;
};

const getTopProducts = async (days: number, limit: number) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));

  return Sale.aggregate([
    { $match: { createdAt: { $gte: start } } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        productName: { $first: "$items.productName" },
        totalQuantity: { $sum: "$items.quantity" },
        totalRevenue: { $sum: "$items.subtotal" },
      },
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: limit },
    {
      $project: {
        _id: 0,
        productId: "$_id",
        productName: 1,
        totalQuantity: 1,
        totalRevenue: 1,
      },
    },
  ]);
};

export const dashboardService = {
  getStats,
  getSalesTrend,
  getTopProducts,
};
