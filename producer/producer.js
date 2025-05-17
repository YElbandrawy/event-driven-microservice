const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'publisher-service',
  brokers: ['kafka:9092'],
});

const producer = kafka.producer();

const actions = ['login', 'logout', 'purchase', 'view', 'click'];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const publishMessage = async () => {
  await producer.connect();
  await producer.send({
    topic: 'user-logs',
    messages: [
      {
        value: JSON.stringify({
          userId: `user-${Math.floor(Math.random() * 1000)}`,
          action: getRandomElement(actions),
          timestamp: Date.now(),
        }),
      },
    ],
  });
  console.log('Message sent!');
  await producer.disconnect();
};

setInterval(publishMessage, 10000);
