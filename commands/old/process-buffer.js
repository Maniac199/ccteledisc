const mysql = require('mysql');

const processBuffer = async (context) => {
    const { client, message, configuration, logChannel, database, args } = context;
    const { mainServerID, botLogsChannel } = configuration;
    const { guild, channel } = message;

    let limit = 100;


    database.getConnection(async (err, con) => {
        if(args[0]) {
            if(args[0] === 'size') {
                limit = 10000;
            }
            else if(args[0] > 0 && args[0] < 100000) {
                limit = args[0];
            }
        }
        const buffer = mysql.format('SELECT * FROM roleBuffer LIMIT ' + limit, [
        ]);
        con.query(buffer, async (err, theBuffer) => {
            if(err) { throw err; }
            if(limit === 10000) {
                logChannel.send('The buffer size is: ' + theBuffer.length);
                return;
            }
            for(let i = 0; i < theBuffer.length; i++) {
                await sleep(2000);
                await processBuff(theBuffer[i], context, con, i);
            }
        });
    });
};

const processBuff = (buff, context, con, counter) => {
    const { client, message, configuration, logChannel, database, args } = context;
    const { mainServerID, botLogsChannel } = configuration;
    let guild = client.guilds.cache.find(g => g.id === buff.guildID);
    if(guild) {
        let member = guild.members.cache.find(m => m.id === buff.memberID);
        let role = guild.roles.cache.find(r => r.id === buff.roleID);
        if(!member) {
            const buffDel = mysql.format('DELETE FROM roleBuffer WHERE id = ' + buff.id, [
            ]);
            con.query(buffDel, (err, result1) => {
                if(err) {throw err; }
            });
        }
        if(buff.type === 'add' && member) {
            member.roles.add(role).catch((err) => context.logger.error(err.message));
            const sqladd = mysql.format('INSERT INTO rolesGranted (memberID, rolesyncID) VALUES (?, ?)', [
                buff.memberID,
                buff.syncID,
            ]);
            const buffDel = mysql.format('DELETE FROM roleBuffer WHERE id = ' + buff.id, [
            ]);
            con.query(sqladd, (err, result) => {
                if(err) { throw err; }
            });
            con.query(buffDel, (err, result1) => {
                if(err) {throw err; }
            });
            if(buff.guildID !== mainServerID) {
                let guildLogChannel = guild.channels.cache.find(c => c.name === 'bot-ops');
                if(guildLogChannel) {
                    guildLogChannel.send(member.user.username + ' granted role: ' + role.name + ' by verification system')
                }
                logChannel.send('(' + counter + '): ' + member.user.username + ' granted foreign server role: ' + role.name + ' by verification system');
            }
            else {
                logChannel.send('(' + counter + '): ' + member.user.username + ' granted role: ' + role.name + ' by verification system');
            }
        }
        if(buff.type === 'remove') {
            member.roles.remove(role).catch((err) => context.logger.error(err.message));
            const sqldel = mysql.format('DELETE FROM rolesGranted WHERE memberID = ? AND rolesyncID = ?', [
                buff.memberID,
                buff.syncID,
            ]);
            const buffDel = mysql.format('DELETE FROM roleBuffer WHERE id = ' + buff.id, [
            ]);
            con.query(sqldel, (err, result) => {
                if(err) { throw err; }
            });
            con.query(buffDel, (err, result1) => {
                if(err) {throw err; }
            });
            if(buff.guildID !== mainServerID) {
                let guildLogChannel = guild.channels.cache.find(c => c.name === 'bot-ops');
                if(guildLogChannel) {
                    guildLogChannel.send(member.user.username + ' revoked role: ' + role.name + ' by verification system')
                }
                logChannel.send('(' + counter + '): ' + member.user.username + ' revoked foreign server role: ' + role.name + ' by verification system');
            }
            else {
                logChannel.send('(' + counter + '): ' + member.user.username + ' revoked role: ' + role.name + ' by verification system');
            }
        }
    }
}

async function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
};

module.exports = processBuffer;