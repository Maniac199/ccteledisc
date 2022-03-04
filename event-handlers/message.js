const { MessageEmbed } = require('discord.js');

const createMessageHandler = context => ctx => {
  const { configuration, client } = context;
  const { mainServerID, botLogsChannel } = configuration;

  let theGuild = client.guilds.cache.find(g => g.id === mainServerID);
  let logChan = theGuild.channels.cache.find(c => c.id === botLogsChannel);
  let msgContent = ctx.update.channel_post.text;
  let msgSplit = msgContent.slice(msgContent.indexOf('https://')).trim().split('\n');
  console.log(msgSplit[0]);
  console.log(msgSplit[0].indexOf('youtu.be'));
  console.log(msgSplit[0].indexOf('youtube'));
  if(msgSplit[0].indexOf('youtu.be') > -1 || msgSplit[0].indexOf('youtube') > -1) {
    console.log('video');
  }
  else {
    console.log('image');
  }
  const embedMsg = new MessageEmbed()
      .setColor(0x3498DB)
      .setAuthor({name: "CryptoCache"})
      .setTitle("Swing Trade Alert")
      .setDescription(msgContent)
      .setTimestamp();
  logChan.send({ embeds: [embedMsg] });
};

module.exports = { createMessageHandler };
