const dotenv = require('dotenv'),
  { MongoClient } = require('mongodb');
const mongoose = require('mongoose');

dotenv.config();
const url_db = process.env.DB;

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
