
const verify = (context) => {
  const { message, configuration, logger } = context;
  const { mainServerID, botLogsChannel } = configuration;
  const { guild, channel } = message;

  if (guild.id !== mainServerID || channel.id !== botLogsChannel) {
    return;
  }
  message.reply(message.author.name + ' I will continue the verification process via PM!');
  message.author.send('Please enter your email address that you registered with.');
};

module.exports = verify;
