const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect('mongodb+srv://Pranali:ucsAdLmhDjhdgu22@cluster0.lqn3xio.mongodb.net/?retryWrites=true&w=majority');
//mongoose.connect(process.env.mongooseUrl);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error Connecting to Database!'));

db.once('open', function() {
  console.log("Successfully Connected to Database :: MongoDB");
});

module.exports = db;

