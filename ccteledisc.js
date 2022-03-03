const Discord = require('discord.js');
const telegram = require('node-telegram-bot-api');
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

const teleClient = new telegram(configuration.teleToken, {polling: true});

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
const onMessageHandler = createMessageHandler(context);

// Setup handlers
client.on('ready', onReadyHandler);
teleClient.on('message', onMessageHandler);

// Start bots
client.login(configuration.botToken);
