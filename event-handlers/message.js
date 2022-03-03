const commandList = require('../command-list');

const createMessageHandler = (ctx, context) => (message) => {
  const { configuration } = context;
  const { message } = ctx;
  //const { text, chat, from } = message;
  //const { botLogsChannelName, botPrefix, botListenChannel } = configuration;

  // Don't respond to messages that don't have the correct
  // prefix, are from another bot or aren't in the correct
  // bot channel.

  /*if (
    !content.startsWith(botPrefix) ||
    author.bot ||
      (channel.name !== botLogsChannelName && channel.type !== 'dm' && channel.id !== botListenChannel)
  ) {
    //console.log('exited from message');
    return;
  }
*/
  //context.message = message;
  //context.args = message.text.slice(botPrefix.length).trim().split(' ');
  //const userCommandEntry = context.args.shift();

  const command = commandList.find((cmd) => cmd.name === "hello");
  if (command) {
    command.execute(ctx, context);
  }
};

module.exports = createMessageHandler;
