const createMessageHandler = ctx => {
 // const { configuration, logger, teleClient } = context;
  //const { update } = ctx;
  //const { mainServerID, botLogsChannel } = configuration;
  //const { text, chat, from } = message;
  console.log('message handler called');
  //console.log(ctx);
  //const chatID = chat.id;
  ctx.reply('You said: ' + ctx.update.channel_post.text);
};

module.exports = { createMessageHandler };
