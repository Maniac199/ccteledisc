
const hello = (context) => {
  const { message, configuration, logger, teleClient } = context;
  //const { mainServerID, botLogsChannel } = configuration;
  const { text, chat, from } = message;

  console.log(message);

  const chatID = chat.id;
  teleClient.sendMessage(chatID, 'You said: ' + text);
};

module.exports = hello;
