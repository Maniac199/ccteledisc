const commandList = require('../command-list');

const createLookupHandler = context => ctx => {
  const { configuration } = context;
  const { botPrefix, botLogsChannel} = configuration;
  context.ctx = ctx;
  let logChan = theGuild.channels.cache.find(c => c.id === botLogsChannel);
  try {
    if (ctx.update.message.text) {
      logChan.send(ctx.update.message.text);
      if (ctx.update.message.text.startsWith(botPrefix)) {
        context.args = ctx.update.message.text.slice(botPrefix.length).trim().split(' ');
        const userCommandEntry = context.args.shift();

        const command = commandList.find((cmd) => cmd.name === userCommandEntry);

        if (command) {
          command.execute(context);
        }
      }
    }
  } catch (e) {

  }
};

module.exports = { createLookupHandler };
