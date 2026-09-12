const {createClient} = require('redis');

const redis = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redis.on("error", (error) => {
  console.error("Redis Client Error:", error);
});

module.exports = redis;