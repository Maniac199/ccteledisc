const createMessageHandler = (ctx, context) => () => {
  const { configuration, logger, teleClient } = context;
  const { message } = ctx;
  //const { mainServerID, botLogsChannel } = configuration;
  //const { text, chat, from } = message;
  console.log('message handler called');
  console.log(ctx);
  //const chatID = chat.id;
  ctx.reply('You said: ' + ctx.message.text);
};

module.exports = createMessageHandler;
