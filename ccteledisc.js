const Discord = require('discord.js');
const { Telegraf } = require('telegraf');
const configuration = require('./configuration');
const createDatabase = require('./database');
const createLogger = require('./logger');
const createOnReadyHandler = require('./event-handlers/ready');
const createMessageHandler = require('./event-handlers/message');

const logger = createLogger(configuration);

// Create a client
const client = new Discord.Client({
  ws: { intents: new Discord.Intents(Discord.Intents.ALL) },
});

const teleClient = new Telegraf(configuration.teleToken);

// Get a database object
const billingDB = createDatabase(configuration).billingDB;
const botDB = createDatabase(configuration).botDB;
const botCache = [];
// Create the context
const context = {
  client,
  teleClient,
  logger,
  billingDB,
  botDB,
  botCache,
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
teleClient.on('channel_post', (ctx) => {
  ctx.reply('You said ' + ctx.message.text);
  console.log(ctx);
  createMessageHandler(ctx, context);
});



// Start bots
client.login(configuration.botToken);
teleClient.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))