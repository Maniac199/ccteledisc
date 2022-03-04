const { MessageEmbed } = require('discord.js');

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
  /*const embedMsg = new MessageEmbed()
      .setColor(0x3498DB)
      .setAuthor({name: "CryptoCache"})
      .setTitle("Swing Trade Alert")
      .setDescription('test')
      .setTimestamp();*/
  const exampleEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Some title')
      .setURL('https://discord.js.org/')
      .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
      .setDescription('Some description here')
      .setThumbnail('https://i.imgur.com/AfFp7pu.png')
      .addFields(
          { name: 'Regular field title', value: 'Some value here' },
          { name: '\u200B', value: '\u200B' },
          { name: 'Inline field title', value: 'Some value here', inline: true },
          { name: 'Inline field title', value: 'Some value here', inline: true },
      )
      .addField('Inline field title', 'Some value here', true)
      .setImage('https://i.imgur.com/AfFp7pu.png')
      .setTimestamp()
      .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

  logChan.send('testing');
  //logChan.send({ embeds: [exampleEmbed] });
 // logChan.send({ embeds: [embedMsg] });
  //console.log({ embed: [embed] })
};

module.exports = { createMessageHandler };
