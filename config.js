const dotenv = require('dotenv');

dotenv.config();

const config = {
  port: parseInt(process.env.PORT, 10) || 8080,
  CHERISH_URL: process.env.CHERISH_URL,
  FCM_TOKEN: process.env.FCM_TOKEN,
};

module.exports = config;
