const { Intents, Client } = require('discord.js');
const { Telegraf } = require('telegraf');
const configuration = require('./configuration');
const createLogger = require('./logger');
const createOnReadyHandler = require('./event-handlers/ready');
const { createMessageHandler } = require('./event-handlers/message');

const logger = createLogger(configuration);

// Create a client
const allIntents = new Intents(32767);
console.log(allIntents);
const client = new Client({ allIntents });

const teleClient = new Telegraf(configuration.teleToken);

// Get a database object

// Create the context
const context = {
  client,
  teleClient,
  logger,
  configuration,
  logChannel: '', // There's better ways of doing this but this won't hurt in a small app like this
  reportChannel: '',
};

// Create Handlers
const onReadyHandler = createOnReadyHandler(context);
//const onMessageHandler = createMessageHandler(context);


// Setup handlers
client.on('ready', onReadyHandler);
teleClient.start((ctx) => { ctx.reply('Starting'); });
teleClient.on('channel_post', createMessageHandler(context));



// Start bots
client.login(configuration.botToken);
teleClient.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))