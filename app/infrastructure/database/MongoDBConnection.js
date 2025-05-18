const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

//////////////////Connect DataBase//////////////////
let db_uri = process.env.DATABASE_URL;

db_uri = db_uri
  .replace('<db_username>', process.env.DATABASE_USERNAME)
  .replace('<db_password>', process.env.DATABASE_PASSWORD);

const connectMongo = async () => {
  try {
    await mongoose
      .connect(db_uri, {
        dbName: 'Logs',
        retryWrites: true,
        serverSelectionTimeoutMS: 5000,
        authSource: 'admin',
      })
      .then((con) => {
        console.log('DataBase connection Established!');
      });
  } catch (error) {
    console.error('Database connection failed:', error);
    setTimeout(connectMongo, 5000);
  }
};

module.exports = connectMongo;
