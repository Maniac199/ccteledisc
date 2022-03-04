const createOnReadyHandler = (context) => () => {
  const { client, configuration, logger } = context;

  logger.info(`Logged in as ${client.user.tag}!`);

  context.logChannel = client.guilds.cache
    .find((guild) => guild.id === configuration.mainServerID)
    .channels.cache.find(
      (channel) => channel.id === configuration.botLogsChannel
    );
};

module.exports = createOnReadyHandler;
