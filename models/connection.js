const mongoose = require('mongoose');

const connectionString = "mongodb+srv://admin67:61Q2Kd31CdtuT8MF@cluster0.uwggd.mongodb.net/hackatweet";

mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log('🎉Database connected'))
  .catch(error => console.error(error));
