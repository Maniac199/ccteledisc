const dotenv = require('dotenv');

// Set up the env variables
dotenv.config();

const configuration = {
  botName: process.env.BOT_NAME,
  mainServerID: process.env.MAIN_SERVER_ID,
  botLogsChannel: process.env.BOT_LOGS_CHANNEL,
  botLogsChannelName: process.env.BOT_LOGS_CHANNEL_NAME,
  botToken: process.env.BOT_TOKEN,
  billingDatabaseHost: process.env.BILLING_DATABASE_HOST,
  billingDatabaseUser: process.env.BILLING_DATABASE_USERNAME,
  billingDatabasePassword: process.env.BILLING_DATABASE_PASSWORD,
  billingDatabaseName: process.env.BILLING_DATABASE_NAME,
  botDatabaseHost: process.env.BOT_DATABASE_HOST,
  botDatabaseUser: process.env.BOT_DATABASE_USERNAME,
  botDatabasePassword: process.env.BOT_DATABASE_PASSWORD,
  botDatabaseName: process.env.BOT_DATABASE_NAME,
  botPrefix: process.env.BOT_PREFIX,
  logFile: process.env.LOG_FILE,
  errorLogFile: process.env.ERROR_LOG_FILE,
  logLevel: process.env.LOG_LEVEL,
};

module.exports = configuration;
