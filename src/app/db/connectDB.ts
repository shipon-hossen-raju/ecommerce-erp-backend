import mongoose from "mongoose";
import config from "../../config";
import { USER_ROLE } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

// Create the default super admin account if it doesn't already exist
const seedSuperAdmin = async () => {
  const existingAdmin = await User.findOne({ email: config.superAdmin.email });
  if (existingAdmin) return;

  await User.create({
    name: config.superAdmin.name,
    email: config.superAdmin.email,
    password: config.superAdmin.password,
    role: USER_ROLE.ADMIN,
  });

  console.log(`✅ Super admin seeded: ${config.superAdmin.email}`);
};

// Connect to MongoDB and seed the super admin on startup
export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return mongoose.connection;

  try {
    await mongoose.connect(config.mongodbUri);
    console.log("✅ MongoDB connected successfully!");

    await seedSuperAdmin();
    return mongoose.connection;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    if (!process.env.VERCEL) process.exit(1);
    throw error;
  }
};
