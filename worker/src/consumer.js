const { Kafka } = require("kafkajs");
const prisma = require("./config/prisma");
const { createClient } = require("redis");

const redis = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redis.on("error", (error) => {
  console.error("Redis Client Error:", error);
});

const kafka = new Kafka({
  clientId: "pulsemetrics-worker",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({
  groupId: "pulsemetrics-worker-group",
});

const run = async () => {
  await redis.connect();
  console.log("Redis connected");
  await consumer.connect();

  await consumer.subscribe({
    topic: "pulsemetrics-events",
    fromBeginning: true,
  });

  console.log("Kafka consumer connected");

  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value.toString());

      console.log("Received event:", event);

      const project = await prisma.project.findUnique({
        where: {
          id: event.projectId,
        },
        select: {
          companyId: true,
        },
      });

      console.log("Company ID:", project.companyId);

      await prisma.event.create({
        data: {
          eventName: event.eventName,
          properties: event.properties,
          projectId: event.projectId,
        },
      });

      console.log("Event saved to PostgreSQL");
      const cacheKey = `overview:company:${project.companyId}`;

      await redis.del(cacheKey);

      console.log("Overview cache invalidated");
    },
  });
};

run().catch(async (error) => {
  console.error("Worker error:", error);
  await prisma.$disconnect();
});
