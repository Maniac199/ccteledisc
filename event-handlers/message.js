const createMessageHandler = context => ctx => {
  const { configuration, client } = context;
  const { mainServerID, botLogsChannel } = configuration;
  let theGuild = client.guilds.cache.find(g => g.id === mainServerID);
  let logChan = theGuild.channels.cache.find(c => c.id === botLogsChannel);


  console.log('message handler called');
  //console.log(ctx);
  //const chatID = chat.id;
  ctx.reply('You said: ' + ctx.update.channel_post.text + ' and botlogschannel is: ' + botLogsChannel);
  logChan.send('From Telegram test channel: ' + ctx.update.channel_post.text);
};

module.exports = { createMessageHandler };
