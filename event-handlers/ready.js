const mysql = require('mysql');

const createOnReadyHandler = (context) => () => {
  const { client, configuration, logger, billingDB, botDB } = context;

  logger.info(`Logged in as ${client.user.tag}!`);

  context.logChannel = client.guilds.cache
    .find((guild) => guild.id === configuration.mainServerID)
    .channels.cache.find(
      (channel) => channel.id === configuration.botLogsChannel
    );

  const checkQuery = mysql.format('SELECT 1+1 AS result');

  billingDB.getConnection((err, con) => {
    if (err) {
      logger.error(`Unable to connect to billing database: ${err.message}`);
    } else {
      con.query(checkQuery, (err, result) => {
        if (err) {
          logger.error(`Error querying billing database: ${err.message}`);
        } else if(result) {
          logger.info(`Successfully connected to billing database`);
        }
      });
    }
  });
  botDB.getConnection((err, con) => {
    if (err) {
      logger.error(`Unable to connect to bot database: ${err.message}`);
    } else {
      con.query(checkQuery, (err, result) => {
        if (err) {
          logger.error(`Error querying bot database: ${err.message}`);
        } else if(result){
          logger.info(`Successfully connected to bot database`);
        }
      });
    }
  });

  //client.user.setActivity(' | $verify', { type: 'WATCHING' });
};

module.exports = createOnReadyHandler;
