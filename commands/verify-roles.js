const mysql = require('mysql');

const verifyRoles = async (context) => {

    await externalRun(context);
    await internalRun(context);

};

const internalRun = (context) => {
    const { client, message, configuration, logChannel, database, args } = context;
    const { mainServerID, botLogsChannel } = configuration;

    database.getConnection( async (err, con) => {
        let results = [];
        let extRoles = mysql.format('SELECT extRoleID, id FROM approvedServers WHERE type = ? GROUP BY extRoleID, id', [
            "internal",
        ]);
        con.query(extRoles, async (err, extRoles) => {
            if (err) {
                throw err;
            }
            for await(let roles of extRoles) {
                let extMembers = [];
                let mainMembers = [];
                await getMembers(mainMembers, roles.id, client);
                const theRole = client.guilds.cache.find(g => g.id === roles.id)
                    .roles.cache.find(r => r.id === roles.extRoleID);
                const extRolesByID = mysql.format('SELECT * FROM approvedServers WHERE type = ? AND extRoleID = ?', [
                    "internal",
                    roles.extRoleID,
                ]);

                con.query(extRolesByID, async (err, extRolesByID) => {
                    if (err) {
                        throw err;

                    }

                    for await(let rolesByID of extRolesByID) {
                        await getRoleMembers(extMembers, mainServerID, rolesByID.roleID, client, rolesByID.syncID);
                    }
                    results = await verifyMem(mainMembers, extMembers, client, roles.id, "internal", theRole, results, con);
                    logChannel.send(results.length + ' members need to be assigned/revoked role: ' + theRole.name + ' in foreign server');
                    if(results.length > 0) {
                        logChannel.send(results);
                        client.guilds.cache.find(g => g.id === roles.id)
                            .channels.cache.find(c => c.name === 'bot-ops')
                            .send(results);
                    }
                    results = [];
                });
            }
        });
        con.release();
    });
}

const externalRun = (context) => {
    const { client, message, configuration, logChannel, database, args } = context;
    const { mainServerID, botLogsChannel } = configuration;
    database.getConnection( async (err, con) => {
        let mainMembers = [];
        await getMembers(mainMembers, mainServerID, client);
        let results = [];
        let extRoles = mysql.format('SELECT roleID FROM approvedServers WHERE type = ? GROUP BY roleID', [
            "external",
        ]);
        con.query(extRoles, async (err, extRoles) => {
            if (err) {
                throw err;
            }
            for await(let roles of extRoles) {
                let extMembers = [];
                const theRole = client.guilds.cache.find(g => g.id === mainServerID)
                    .roles.cache.find(r => r.id === roles.roleID);
                const extRolesByID = mysql.format('SELECT * FROM approvedServers WHERE type = ? AND roleID = ?', [
                    "external",
                    roles.roleID,
                ]);

                con.query(extRolesByID, async (err, extRolesByID) => {
                    if (err) {
                        throw err;
                    }

                    for await(let rolesByID of extRolesByID) {
                        await getRoleMembers(extMembers, rolesByID.id, rolesByID.extRoleID, client, rolesByID.syncID);
                    }
                    results = await verifyMem(mainMembers, extMembers, client, mainServerID, "external", theRole, results, con);
                    logChannel.send(results.length + ' members need to be assigned/revoked role: ' + theRole.name);
                    if(results.length > 0) {
                        logChannel.send(results);
                    }
                    results = [];
                });
            }
        });
        con.release();
    });
}


const getMembers = (membersArray, guildID, client) => {
    let theGuild = client.guilds.cache.find(g => g.id === guildID);
    if(theGuild) {
        let theMembers = theGuild.members.cache;
        theMembers.forEach(mem => {
            membersArray.push(mem.id);
        });
    }
    return membersArray;
}

const getRoleMembers = (membersArray, guildID, roleID, client, syncID) => {
    let theGuild = client.guilds.cache.find(g => g.id === guildID);
    if(theGuild) {
        let theRole = theGuild.roles.cache.find(r => r.id === roleID);
        if(theRole) {
            let RoleMembers = theRole.members;
            RoleMembers.forEach(mem => {
                let line = []
                line.push(mem.id);
                line.push(syncID);
                membersArray.push(line);
            });
        }
    }
    return membersArray;
}

const verifyMem = async (mainMembers, extMembers, client, mainServerID, type, theRole, results, con) => {
    for await (let mainMem of mainMembers) {
        let theMember = await client.guilds.cache.find(g => g.id === mainServerID)
            .members.cache.find(m => m.id === mainMem);
        let memRole = await getMemRoles(theMember);
        let verifyMem = memRole.some(r => r === theRole.id);
        let eRole = await extMembers.some(m => m[0] === mainMem);
        let ro = await extMembers.find(m => m[0] === mainMem);

        if (!verifyMem && eRole) {
            results.push(theMember.user.username + ' is missing role ' + theRole.name);
            const bufferAdd = mysql.format('INSERT INTO roleBuffer (guildID, roleID, memberID, syncID, type) VALUES (?, ?, ?, ?, ?)', [
                mainServerID,
                theRole.id,
                theMember.id,
                ro[1],
                "add",
            ]);
            con.query(bufferAdd, (err, toAdd) => {
                if(err) { throw err; }
            });
        }
        else if(type === 'internal' && verifyMem && !eRole) {
            results.push(theMember.user.username + ' needs role revoked ' + theRole.name);
            const bufferAdd = mysql.format('INSERT INTO roleBuffer (guildID, roleID, memberID, syncID, type) VALUES (?, ?, ?, ?, ?)', [
                mainServerID,
                theRole.id,
                theMember.id,
                0,
                "remove",
            ]);
            con.query(bufferAdd, (err, toAdd) => {
                if(err) { throw err; }
            });
        }
    }
    return results;
}

const getMemRoles = (theMember) => {
    let listOfRoles  = [];
    theMember.roles.cache.forEach(r => {
        listOfRoles.push(r.id);
    });
    return listOfRoles;
}

module.exports = verifyRoles
