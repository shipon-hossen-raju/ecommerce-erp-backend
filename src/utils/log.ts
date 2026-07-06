import config from "../config";

export function log(...args: unknown[]) {
  if (config.isDev) {
    console.log("📋 LOG:", ...args);
  }
}
