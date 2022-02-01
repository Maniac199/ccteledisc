const Discord = require('discord.js');
const configuration = require('./configuration');
const createDatabase = require('./database');
const createLogger = require('./logger');
const createOnReadyHandler = require('./event-handlers/ready');
const createGuildMemberAddHandler = require('./event-handlers/guild-member-add');
const createGuildMemberUpdateHandler = require('./event-handlers/guild-member-update');
const createMessageHandler = require('./event-handlers/message');

const logger = createLogger(configuration);

// Create a client
const client = new Discord.Client({
  ws: { intents: new Discord.Intents(Discord.Intents.ALL) },
});

// Get a database object
const database = createDatabase(configuration);

// Create the context
const context = {
  client,
  logger,
  database,
  configuration,
  logChannel: '', // There's better ways of doing this but this won't hurt in a small app like this
  reportChannel: '',
};

// Create Handlers
const onReadyHandler = createOnReadyHandler(context);
const onGuildMemberAddHandler = createGuildMemberAddHandler(context);
const onGuildMemberUpdateHandler = createGuildMemberUpdateHandler(context);
const onMessageHandler = createMessageHandler(context);

// Setup handlers
//client.on('ready', onReadyHandler);
//client.on('guildMemberAdd', onGuildMemberAddHandler);
//client.on('guildMemberUpdate', onGuildMemberUpdateHandler);
client.on('message', onMessageHandler);

// Start bot
client.login(configuration.botToken);
