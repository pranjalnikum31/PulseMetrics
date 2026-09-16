const { producer } = require("../config/kafka");

const run = async () => {
  await producer.connect();

  await producer.send({
    topic: "pulsemetrics-events",
    messages: [
      {
        value: JSON.stringify({
          eventName: "test_event",
          properties: {
            source: "kafka-test",
          },
        }),
      },
    ],
  });

  console.log("Test event sent to Kafka");

  await producer.disconnect();
};

run();