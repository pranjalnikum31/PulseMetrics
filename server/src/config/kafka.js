const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "pulsemetrics-server",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

const connectKafka = async () => {
  await producer.connect();
  console.log("Kafka producer connected");
};

module.exports = {
  kafka,
  producer,
  connectKafka,
};