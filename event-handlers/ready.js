const mysql = require('mysql');

const createOnReadyHandler = (context) => () => {
  const { client, configuration, logger, billingDB, botDB } = context;
  const {mainServerID, botLogsChannel} = configuration;

  logger.info(`Logged in as ${client.user.tag}!`);

  context.logChannel = client.guilds.cache
    .find((guild) => guild.id === configuration.mainServerID)
    .channels.cache.find(
      (channel) => channel.id === configuration.botLogsChannel
    );

  const checkQuery = mysql.format('SELECT 1+1 AS result');

  billingDB.getConnection((err, con) => {
    if (err) {
      logger.error(`Unable to connect to database: ${err.message}`);
    } else {
      con.query(checkQuery, (err, result) => {
        if (err) {
          logger.error(`Error querying database: ${err.message}`);
        } else {
          logger.info(`Successfully connected to database`);
        }
      });
    }
  });
  botDB.getConnection((err, con) => {
    if (err) {
      logger.error(`Unable to connect to database: ${err.message}`);
    } else {
      con.query(checkQuery, (err, result) => {
        if (err) {
          logger.error(`Error querying database: ${err.message}`);
        } else {
          logger.info(`Successfully connected to database`);
        }
      });
    }
  });

  //client.user.setActivity(' | $verify', { type: 'WATCHING' });
};

module.exports = createOnReadyHandler;
