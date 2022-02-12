const commandList = require('../command-list');

const createMessageHandler = (context) => (message) => {
  const { configuration } = context;
  const { content, author, channel } = message;
  const { botLogsChannelName, botPrefix, botListenChannelName } = configuration;

  // Don't respond to messages that don't have the correct
  // prefix, are from another bot or aren't in the correct
  // bot channel.

  if (
    !content.startsWith(botPrefix) ||
    author.bot ||
      (channel.name !== botLogsChannelName && channel.type !== 'dm' && channel.name !== botListenChannelName)
  ) {
    console.log('exited from message');
    return;
  }

  context.message = message;
  context.args = message.content.slice(botPrefix.length).trim().split(' ');
  const userCommandEntry = context.args.shift();

  const command = commandList.find((cmd) => cmd.name === userCommandEntry);

  if (command) {
    command.execute(context);
  }
};

module.exports = createMessageHandler;
