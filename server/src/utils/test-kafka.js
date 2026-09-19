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
          projectId: "bdd24cb6-d988-4a4f-83d0-9ed63e1131d8",
        }),
      },
    ],
  });

  console.log("Test event sent to Kafka");

  await producer.disconnect();
};

run();