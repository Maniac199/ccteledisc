const Discord = require('discord.js');

const createMessageHandler = context => ctx => {
  const { configuration, client } = context;
  const { mainServerID, botLogsChannel } = configuration;
  let theGuild = client.guilds.cache.find(g => g.id === mainServerID);
  let logChan = theGuild.channels.cache.find(c => c.id === botLogsChannel);
  let theMem = theGuild.members.cache.find(m => m.id === '233762968288886784');

  //console.log('message handler called');
  //console.log(ctx);
  //const chatID = chat.id;
  ctx.reply('You said: ' + ctx.update.channel_post.text + ' and botlogschannel is: ' + botLogsChannel);
  const embedMsg = new Discord.MessageEmbed()
      .setColor(0x3498DB)
      .setAuthor("CryptoCache")
      .setTitle("Swing Trade Alert")
      .setDescription('test')
      .setTimestamp();
  logChan.send({ embeds: [embedMsg] });
  //console.log({ embed: [embed] })
};

module.exports = { createMessageHandler };
