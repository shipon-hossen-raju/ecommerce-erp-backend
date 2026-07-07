import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce.number().default(5005),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  MONGODB_URI: z.string({
    required_error: "MONGODB_URI is required",
  }),
  BCRYPT_SALT_ROUNDS: z.coerce.number().default(10),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default("7d"),
  SUPER_ADMIN_NAME: z.string().default("Super Admin"),
  SUPER_ADMIN_EMAIL: z.string().email().default("admin@example.com"),
  SUPER_ADMIN_PASSWORD: z.string().default("Admin@123"),
  CLOUDINARY_CLOUD_NAME: z.string({
    required_error: "CLOUDINARY_CLOUD_NAME is required",
  }),
  CLOUDINARY_API_KEY: z.string({
    required_error: "CLOUDINARY_API_KEY is required",
  }),
  CLOUDINARY_API_SECRET: z.string({
    required_error: "CLOUDINARY_API_SECRET is required",
  }),
});

const parsedEnv = EnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "❌ Invalid environment variables:",
    parsedEnv.error.flatten().fieldErrors,
  );

  process.exit(1);
}

const env = parsedEnv.data;

const isDev = env.NODE_ENV === "development";
console.log(
  "project is running in ",
  `${isDev ? "development 🛠️ " : "production 🚀 "} mode.`,
);

const corsOrigin = [
  env.FRONTEND_URL,
  "http://localhost:5173",
  "https://ecommerce-erp-frontend.vercel.app",
];

export default {
  env: env.NODE_ENV,
  isDev,
  port: env.PORT,
  mongodbUri: env.MONGODB_URI,
  bcrypt_salt_rounds: env.BCRYPT_SALT_ROUNDS,
  backendApi: `http://localhost:${env.PORT}/api/v1`,
  corsOrigin,
  jwt: {
    jwt_secret: env.JWT_SECRET,
    expires_in: env.JWT_EXPIRES_IN,
  },
  superAdmin: {
    name: env.SUPER_ADMIN_NAME,
    email: env.SUPER_ADMIN_EMAIL,
    password: env.SUPER_ADMIN_PASSWORD,
  },

  cloudinary: {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
  },
};
