const createMessageHandler = (ctx, context) => (message) => {
  const { message, configuration, logger, teleClient } = context;
  //const { mainServerID, botLogsChannel } = configuration;
  //const { text, chat, from } = message;
  console.log('message handler called');
  console.log(ctx);

  //const chatID = chat.id;
  ctx.reply('You said: ' + ctx.message.text);
};

module.exports = createMessageHandler;
