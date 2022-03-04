const { MessageEmbed } = require('discord.js');

const createMessageHandler = context => ctx => {
  const { configuration, client } = context;
  const { mainServerID, botLogsChannel } = configuration;

  let theGuild = client.guilds.cache.find(g => g.id === mainServerID);
  let logChan = theGuild.channels.cache.find(c => c.id === botLogsChannel);
  let msgContent = ctx.update.channel_post.text;
  let msgSplit = msgContent.slice(msgContent.indexOf('https://')).trim().split('\n');



  if(msgSplit[0].length > 5) {
    if (msgSplit[0].indexOf('youtu.be') === -1 && msgSplit[0].indexOf('youtube') === -1) {
      const embedMsg = new MessageEmbed()
        .setColor(0x3498DB)
        .setAuthor({name: "CryptoCache"})
        .setTitle("Swing Trade Alert")
        .setDescription(msgContent)
        .setImage(msgSplit[0])
        .setTimestamp();
      logChan.send({ embeds: [embedMsg] });
      console.log('image');
    }
  }
  else {
    const embedMsg = new MessageEmbed()
        .setColor(0x3498DB)
        .setAuthor({name: "CryptoCache"})
        .setTitle("Swing Trade Alert")
        .setDescription(msgContent)
        .setTimestamp();
    logChan.send({ embeds: [embedMsg] });
  }

};

module.exports = { createMessageHandler };
