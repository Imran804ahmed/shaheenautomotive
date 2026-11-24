import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const derive = promisify(scrypt);
const version = "scrypt-32768-8-3";
const work = { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 };

export const dummyHash = `${version}:${"0".repeat(32)}:${"0".repeat(128)}`;

export async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = await derive(password, salt, 64, work);
  return `${version}:${salt}:${hash.toString("hex")}`;
}

export async function verifyPassword(password, stored) {
  const [algorithm, salt, expected] = stored.split(":");
  if (algorithm !== version || !/^[a-f0-9]{32}$/.test(salt) || !/^[a-f0-9]{128}$/.test(expected)) return false;
  const hash = await derive(password, salt, 64, work);
  return timingSafeEqual(hash, Buffer.from(expected, "hex"));
}
