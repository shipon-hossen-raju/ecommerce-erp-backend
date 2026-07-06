import mongoose from "mongoose";
import config from "../../config";
import { USER_ROLE } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

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

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log("✅ MongoDB connected successfully!");

    await seedSuperAdmin();
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};
