import { createClient } from "redis";

const REDIS_PORT = 6379;

const redisClient = createClient({
  url: `redis://localhost:${REDIS_PORT}`,
});

// client methods
// publisher and subscriber

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

redisClient.on("connect", () => {
  console.log("Redis client connected successfully");
});

redisClient.on("ready", () => {
  console.log("Redis client is ready to use");
});

redisClient.on("error", (err) => {
  console.error("Redis client error:", err);
});

export default redisClient;
