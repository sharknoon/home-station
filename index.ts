import dns from "node:dns/promises";
import http from "node:http";
import net from "node:net";
import os from "node:os";

export async function getPublicIp(): Promise<string> {
  return new Promise((resolve, reject) => {
    http.get({ host: "api.ipify.org", port: 80, path: "/" }, (resp) => {
      resp.on("data", (ip) => {
        resolve(String(ip));
      });
      resp.on("error", reject);
    });
  });
}

export async function detectHostnames(): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = net.connect({ port: 80, host: "google.com" }, () => {
      resolve(client.localAddress ?? "");
    });
    client.on("error", reject);
  });
}

console.log("public ip: " + (await getPublicIp()));
console.log(
  "internal ip: " + JSON.stringify(await dns.resolve("host.docker.internal"))
);
console.log(
  "gateway ip: " + JSON.stringify(await dns.resolve("gateway.docker.internal"))
);
console.log("hostname: " + os.hostname());
//console.log("host ip: " + (await dns.lookup(os.hostname()))?.address);

