
const addRole = (context) => {
  const { message, configuration } = context;
  const { mainServerID, botLogsChannel } = configuration;
  const { guild, channel } = message;

  if (guild.id !== mainServerID || channel.id !== botLogsChannel) {
    return;
  }
  message.reply('hello ' + message.author.id);
};

module.exports = addRole;
