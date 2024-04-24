const dotenv = require('dotenv'),
  { MongoClient } = require('mongodb');
const mongoose = require('mongoose');

dotenv.config();
const url_db =
  'mongodb://admin2024:paSSwordMongodb2024@77.37.67.76:27017/dsh?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false';

mongoose.connect(url_db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = db;
