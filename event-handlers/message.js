const createMessageHandler = context => ctx => {
  const { configuration, client, embedMsg } = context;
  const { mainServerID, botLogsChannel } = configuration;
  let theGuild = client.guilds.cache.find(g => g.id === mainServerID);
  let logChan = theGuild.channels.cache.find(c => c.id === botLogsChannel);


  //console.log('message handler called');
  //console.log(ctx);
  //const chatID = chat.id;
  ctx.reply('You said: ' + ctx.update.channel_post.text + ' and botlogschannel is: ' + botLogsChannel);
  embedMsg.setColor(0x3498DB)
      .setAuthor("Author Name, it can hold 256 characters", "https://i.imgur.com/lm8s41J.png")
      .setTitle("This is your title, it can hold 256 characters")
      .setURL("https://discord.js.org/#/docs/main/stable/class/MessageEmbed")
      .setDescription("This is the main body of text, it can hold 4096 characters.")
      .setImage("http://i.imgur.com/yVpymuV.png")
      .setThumbnail("http://i.imgur.com/p2qNFag.png")
      .addField("This is a single field title, it can hold 256 characters", "This is a field value, it can hold 1024 characters.")
      /*
       * Inline fields may not display as inline if the thumbnail and/or image is too big.
       */
      .addFields(
          { name: "Inline fields", value: "They can have different fields with small headlines, and you can inline them.", inline: true },
          { name: "Masked links", value: "You can put [masked links](https://discord.js.org/#/docs/main/master/class/MessageEmbed) inside of rich embeds.", inline: true },
          { name: "Markdown", value: "You can put all the *usual* **__Markdown__** inside of them.", inline: true }
      )
      /*
       * Blank field, useful to create some space.
       */
      .addField("\u200b", "\u200b")
      /*
       * Takes a Date object, defaults to current date.
       */
      .setTimestamp()
      .setFooter("This is the footer text, it can hold 2048 characters", "http://i.imgur.com/w1vhFSR.png");

      /*.setColor(0x3498DB)
      .setAuthor("CryptoCache", "https://cryptocache.tech/wp-content/themes/cobalt-theme2.0/img/cc_logo.png")
      .setTitle("Swing Trade Alert")
      .setDescription('test')
      .setTimestamp();*/
  console.log({ embeds: [embedMsg] });
  logChan.send({ embeds: [embedMsg] });
};

module.exports = { createMessageHandler };
