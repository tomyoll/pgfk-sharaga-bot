const mongoose = require('mongoose');

module.exports = async () => {
  const connectionString = process.env.DB_CONNECTION_STRING;
  const connectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  await mongoose.connect(connectionString, connectOptions).then(() => {
    console.log(`DATABASE CONNECTED: ${connectionString}`);
  });
};
