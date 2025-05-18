const { Kafka } = require('kafkajs');
const logHandler = require('../../application/logHandler');

const kafka = new Kafka({
  clientId: 'consumer-service',
  brokers: ['kafka:9092'],
});

const consumer = kafka.consumer({ groupId: 'user-activity-group' });

/**
 * Message:{value:{UserId:"123",action:"ordered"}}
 */
const consumeMessages = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: 'user-logs', fromBeginning: true });

    consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const log = JSON.parse(message.value.toString());
        logHandler(log);
      },
    });
    console.log('Consumer started successfully');
  } catch (err) {
    console.error('Error connecting to the consumer or topic not ready', err);
    try {
      await consumer.disconnect();
    } catch (_) {}

    console.log('Retrying in 10 seconds...');
    setTimeout(consumeMessages, 10000);
  }
};

consumer.on(consumer.events.CRASH, async (event) => {
  console.error('consumer crashed:  ', event.payload.error);
  try {
    await consumer.disconnect();
  } catch (err) {
    console.log('unable to disconnect the consumer');
  }
  console.log('reconnecting the consumer in 20 sec....');
  setTimeout(consumeMessages, 20000);
});

module.exports = consumeMessages;
