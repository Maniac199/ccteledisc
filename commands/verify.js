
const verify = (context) => {
  const { message, configuration, logger } = context;
  const { mainServerID, botLogsChannel } = configuration;
  const { guild, channel } = message;

  if (guild.id !== mainServerID || channel.id !== botLogsChannel) {
    return;
  }
  message.reply('Hi ' + message.author.name + ', I can help verify your Premium status. Please enter the email address used in the order');
};

module.exports = verify;
