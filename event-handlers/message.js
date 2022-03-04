const createMessageHandler = context => ctx => {
  const { configuration, client, embedMsg } = context;
  const { mainServerID, botLogsChannel } = configuration;
  let theGuild = client.guilds.cache.find(g => g.id === mainServerID);
  let logChan = theGuild.channels.cache.find(c => c.id === botLogsChannel);


  //console.log('message handler called');
  //console.log(ctx);
  //const chatID = chat.id;
  ctx.reply('You said: ' + ctx.update.channel_post.text + ' and botlogschannel is: ' + botLogsChannel);
  const embed = embedMsg.setColor(0x3498DB)
      .setAuthor("CryptoCache", "https://cryptocache.tech/wp-content/themes/cobalt-theme2.0/img/cc_logo.png")
      .setTitle("Swing Trade Alert")
      .setDescription('test')
      .setTimestamp();
  logChan.send({ embed: [embed] });
  //console.log({ embed: [embed] })
};

module.exports = { createMessageHandler };
