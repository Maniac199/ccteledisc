const mysql = require('mysql');

const onetime = (context) => {
    const {client, message, configuration, billingDB, botDB} = context;
    const {mainServerID, botLogsChannel} = configuration;
    const {guild, channel} = message;

    if (guild.id !== mainServerID || channel.id !== botLogsChannel) {
        return;
    }
    let theGuild = client.guilds.cache.find(g => g.id === mainServerID);
    if(theGuild) {
        let theMembers = theGuild.members.cache;
        let membersArray = [];
        theMembers.forEach(mem => {
            membersArray.push(mem.id);
        });
        message.reply('Found ' + membersArray.length + ' members in the server.');
    }
}

module.exports = onetime;
