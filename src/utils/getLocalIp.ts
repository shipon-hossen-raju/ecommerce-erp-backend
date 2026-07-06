import os from "os";

export function getLocalIP() {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] as any) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
   }
   
  return "0.0.0.0";
}
