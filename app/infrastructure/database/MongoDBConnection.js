const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

//////////////////Connect DataBase//////////////////
const db_uri = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD
);

const connectMongo = async () => {
  try {
    await mongoose.connect(db_uri, { dbName: 'Logs' }).then((con) => {
      console.log('DataBase connection Established!');
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    setTimeout(connectMongo, 5000);
  }
};

module.exports = connectMongo;
