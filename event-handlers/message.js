const { MessageEmbed } = require('discord.js');

const createMessageHandler = context => ctx => {
  const { configuration, client } = context;
  const { mainServerID, teleswing, discswing, teleprem, discprem } = configuration;

  let theGuild = client.guilds.cache.find(g => g.id === mainServerID);

  let swingchan = theGuild.channels.cache.find(c => c.id === discswing);
  let premchan = theGuild.channels.cache.find(c => c.id === discprem);
  let msgContent = ctx.update.channel_post.text;
  console.log(swingchan);
  console.log(premchan);
  console.log(teleprem);
  console.log(teleswing);
  console.log(ctx.update.channel_post.chat.id);
  if(ctx.update.channel_post.chat.id.toString() === teleprem) {
    console.log('premium match');
    const embedMsg = new MessageEmbed()
        .setColor(0x3498DB)
        .setAuthor({name: "CryptoCache"})
        .setTitle("Swing signal")
        .setDescription(msgContent)
        .setTimestamp();
    premchan.send({embeds: [embedMsg]});
  }
  else if(ctx.update.channel_post.chat.id.toString() === teleswing) {
    console.log('swing match');
    const embedMsg = new MessageEmbed()
        .setColor(0x3498DB)
        .setAuthor({name: "CryptoCache"})
        .setTitle("Premium signal")
        .setDescription(msgContent)
        .setTimestamp();
    swingchan.send({embeds: [embedMsg]});
  }

};

module.exports = { createMessageHandler };
