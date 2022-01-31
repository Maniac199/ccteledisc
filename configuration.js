const dotenv = require('dotenv');

// Set up the env variables
dotenv.config();

const configuration = {
  botName: process.env.BOT_NAME,
  mainServerID: process.env.MAIN_SERVER_ID,
  botLogsChannel: process.env.BOT_LOGS_CHANNEL,
  botLogsChannelName: process.env.BOT_LOGS_CHANNEL_NAME,
  botToken: process.env.BOT_TOKEN,
  databaseHost: process.env.DATABASE_HOST,
  databaseUser: process.env.DATABASE_USERNAME,
  databasePassword: process.env.DATABASE_PASSWORD,
  databaseName: process.env.DATABASE_NAME,
  botPrefix: process.env.BOT_PREFIX,
  logFile: process.env.LOG_FILE,
  errorLogFile: process.env.ERROR_LOG_FILE,
  logLevel: process.env.LOG_LEVEL,
};

module.exports = configuration;
