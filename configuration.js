const dotenv = require('dotenv');

// Set up the env variables
dotenv.config();

const configuration = {
  botName: process.env.BOT_NAME,
  mainServerID: process.env.MAIN_SERVER_ID,
  botListenChannel: process.env.BOT_LISTEN_CHANNEL,
  botListenChannelName: process.env.BOT_LISTEN_CHANNEL_NAME,
  botLogsChannel: process.env.BOT_LOGS_CHANNEL,
  botLogsChannelName: process.env.BOT_LOGS_CHANNEL_NAME,
  botToken: process.env.BOT_TOKEN,
  botPrefix: process.env.BOT_PREFIX,
  logFile: process.env.LOG_FILE,
  errorLogFile: process.env.ERROR_LOG_FILE,
  logLevel: process.env.LOG_LEVEL,
  teleToken: process.env.TELETOKEN,
  teleswing: process.env.TELESWING,
  discswing: process.env.DISCSWING,
  teleprem: process.env.TELEPREM,
  discprem: process.env.DISCPREM
};

module.exports = configuration;
