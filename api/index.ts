import { Request, Response } from "express";
import app from "../src/app";
import { connectDB } from "../src/app/db/connectDB";

let dbReady: Promise<unknown> | null = null;

function ensureDB() {
  if (!dbReady) {
    dbReady = connectDB().catch((error) => {
      dbReady = null;
      throw error;
    });
  }
  return dbReady;
}

export default async function handler(req: Request, res: Response) {
  await ensureDB();
  return app(req, res);
}
