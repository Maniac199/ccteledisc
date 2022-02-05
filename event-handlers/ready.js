const mysql = require('mysql');

const createOnReadyHandler = (context) => () => {
  const { client, configuration, logger, billingDB, botDB, botCache } = context;

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
    con.release();
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
          let readyCache = mysql.format('SELECT discord_id FROM discord');
          con.query(readyCache, (err, res) => {
            if(res.length > 0) {
              for(let i of res) {
                botCache.push(i.discord_id);
                console.log(i.discord_id + ' added to botCache');
              }
            }
            else {
              console.log('botCache is empty');
            }
          });
        }
      });
    }
    con.release();

  });

  //client.user.setActivity(' | $verify', { type: 'WATCHING' });
};

module.exports = createOnReadyHandler;
