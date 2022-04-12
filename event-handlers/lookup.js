
const createLookupHandler = context => ctx => {
  const { configuration, client } = context;
  const { mainServerID, botLogsChannel, botPrefix } = configuration;

  let theGuild = client.guilds.cache.find(g => g.id === mainServerID);
  let logChan = theGuild.channels.cache.find(c => c.id === botLogsChannel);

  let msgContent = ctx.update.message.text;

  context.args = ctx.update.message.text.slice(botPrefix.length).trim().split(' ');
  const userCommandEntry = context.args.shift();

  if(userCommandEntry === 'verify' && context.args.length >= 3) {
    logChan.send('command: ' + userCommandEntry + ' email: ' + context.args[0] + ' zip: ' + context.args[1]);
  }
  else {

    logChan.send('command: ' + userCommandEntry + ' message: ' + msgContent);
  }

};

module.exports = { createLookupHandler };
