const { MessageEmbed } = require('discord.js');

const createLookupHandler = context => ctx => {
  const { configuration, client } = context;
  const { mainServerID, botLogsChannel } = configuration;

  let theGuild = client.guilds.cache.find(g => g.id === mainServerID);
  let logChan = theGuild.channels.cache.find(c => c.id === botLogsChannel);

  let msgContent = ctx.update.message.text;

  logChan.send(msgContent);

};

module.exports = { createLookupHandler };
