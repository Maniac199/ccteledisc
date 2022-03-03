
const hello = (ctx, context) => {
  const { message, configuration, logger, teleClient } = context;
  //const { mainServerID, botLogsChannel } = configuration;
  //const { text, chat, from } = message;
  console.log('hello called');
  console.log(ctx);

  //const chatID = chat.id;
  ctx.reply('You said: ' + ctx.message.text);
};

module.exports = hello;
