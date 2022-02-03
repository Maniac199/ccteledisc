
const hello = (context) => {
  const { message, configuration, logger } = context;
  const { mainServerID, botLogsChannel } = configuration;
  const { guild, channel } = message;

  if (guild.id !== mainServerID || channel.id !== botLogsChannel) {
    return;
  }
  message.reply('Hello ' +  message.author.tag + '\nServerID: ' + guild.id + '\nThis Channel ID: ' + channel.id);

  logger.info(`sending hello to ${message.author.id}!`);
};

module.exports = hello;
