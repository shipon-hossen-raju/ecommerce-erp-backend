import { Server } from "http";
import app from "./app";
import { connectDB } from "./app/db/connectDB";
import config from "./config";
import { getLocalIP } from "./utils/getLocalIp";

let server: Server;

async function startServer() {
  await connectDB();

  const ip = getLocalIP();

  server = app.listen(config.port, () => {
    console.log(`
  ╔══════════════════════════════════════════════╗
  ║ 🚀 Server Started :
  ║ 🌐 API     → ${config.backendApi}            
  ║ 🏠 Local   → http://localhost:${config.port} 
  ║ 📡 Network → http://${ip}:${config.port}     
  ╚══════════════════════════════════════════════╝
  `);
  });
}

async function main() {
  await startServer();

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.info("Server closed!");
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  process.on("uncaughtException", (error) => {
    console.log("Uncaught Exception: ", error);
    exitHandler();
  });

  process.on("unhandledRejection", (error) => {
    console.log("Unhandled Rejection: ", error);
    exitHandler();
  });

  process.on("SIGTERM", () => {
    console.log("SIGTERM signal received. Shutting down gracefully...");
    server?.close(() => process.exit(0));
  });

  process.on("SIGINT", () => {
    console.log("SIGINT signal received. Shutting down gracefully...");
    server?.close(() => process.exit(0));
  });
}

main();
