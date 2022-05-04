const { Intents, Client } = require('discord.js');
const { Telegraf } = require('telegraf');
const configuration = require('./configuration');
const createLogger = require('./logger');
const createOnReadyHandler = require('./event-handlers/ready');
const { createMessageHandler } = require('./event-handlers/message');
const { createLookupHandler } = require('./event-handlers/lookup.js');
const createDatabase = require('./database');

const logger = createLogger(configuration);

// Create a client
const allIntents = new Intents(32767);
const client = new Client({ intents: allIntents });

const teleClient = new Telegraf(configuration.teleToken);

// Get a database object
const billingDB = createDatabase(configuration).billingDB;
const botDB = createDatabase(configuration).botDB;
//const botCache = [];
// Create the context
const context = {
  client,
  teleClient,
  logger,
  billingDB,
  botDB,
  //botCache,
  configuration,
  logChannel: '', // There's better ways of doing this but this won't hurt in a small app like this
  reportChannel: '',
};

// Create Handlers
const onReadyHandler = createOnReadyHandler(context);
//const onMessageHandler = createMessageHandler(context);


// Setup handlers
client.on('ready', onReadyHandler);
teleClient.start((ctx) => { ctx.telegram.sendMessage(ctx.message.from.id,"Please respond with: $verify lookup email postcode/zipcode. For example:\n$verify lookup billing@cryptocache.tech 12345"); });
teleClient.on('channel_post', createMessageHandler(context));
teleClient.on('message', createLookupHandler(context))



// Start bots
client.login(configuration.botToken);
teleClient.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))