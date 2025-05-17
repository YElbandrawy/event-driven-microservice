const connectMongo = require('./infrastructure/database/MongoDBConnection');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./interface/app');
const consumer = require('./infrastructure/kafka/consumer');

//////////////////handle uncaught exeptions//////////////////
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});
//////////////////Connect DataBase//////////////////
// const dbStatus = connectMongo();
// if (dbStatus) consumer().catch(console.error);

(async () => {
  try {
    await connectMongo();
    await consumer();
    console.log('Microservice started successfully');
  } catch (error) {
    console.error('Error during startup:', error);
    process.exit(1);
  }
})();
//////////////////Start the server//////////////////
const port = 3000;
const server = app.listen(port, () => {
  console.log(`The server is up and running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
