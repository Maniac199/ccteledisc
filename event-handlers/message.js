const { MessageEmbed } = require('discord.js');

const createMessageHandler = context => ctx => {
  const { configuration, client } = context;
  const { mainServerID, botLogsChannel } = configuration;

  let theGuild = client.guilds.cache.find(g => g.id === mainServerID);
  let logChan = theGuild.channels.cache.find(c => c.id === botLogsChannel);
  let msgContent = ctx.update.channel_post.text;

  const embedMsg = new MessageEmbed()
      .setColor(0x3498DB)
      .setAuthor({name: "CryptoCache"})
      .setTitle(ctx.update.channel_post.chat.id)
      .setDescription(msgContent)
      .setTimestamp();
  logChan.send({ embeds: [embedMsg] });


};

module.exports = { createMessageHandler };
