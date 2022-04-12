const commandList = require('../command-list');

const createLookupHandler = context => ctx => {
  const { configuration } = context;
  const { botPrefix } = configuration;
  context.ctx = ctx;
  context.args = ctx.update.message.text.slice(botPrefix.length).trim().split(' ');
  const userCommandEntry = context.args.shift();
  console.log(userCommandEntry);
  const command = commandList.find((cmd) => cmd.name === userCommandEntry);

  if (command) {
    console.log(command);
    command.execute(context);
  }

};

module.exports = { createLookupHandler };
