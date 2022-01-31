const mysql = require('mysql');

const createGuildMemberUpdateHandler = (context) => (oldMember, newMember) => {
  const { client, configuration, logChannel, database } = context;
  const { mainServerID, botLogsChannel } = configuration;

  let oldRoles = oldMember._roles;
  let newRoles = newMember._roles;
  if (oldRoles.length === newRoles.length) {
    return;
  }
  database.getConnection((err, con) => {
    const select =
      newMember.guild.id === mainServerID
        ? 'SELECT * FROM approvedServers WHERE type = "internal"'
        : mysql.format(
            'SELECT * FROM approvedServers WHERE type = "external" AND id = ?',
            [newMember.guild.id]
          );
    const type = newMember.guild.id === mainServerID ? 'internal' : 'external';

    con.query(select, (err, results) => {
      if (err) throw err;
      results.forEach((r) => {
        let mainServerMember = client.guilds.cache.find(g => g.id === mainServerID).members.cache.find(mem => mem.id === newMember.id);
        let extServerMember = client.guilds.cache.find(g => g.id === r.id).members.cache.find(mem => mem.id === newMember.id);
        if(mainServerMember && extServerMember) {

          if(type === "internal" && oldRoles.some(ro => ro === r.roleID) && !newRoles.some(ro => ro === r.roleID) && extServerMember.manageable) {
            let guild = client.guilds.cache.find(guild => guild.id === r.id);
            let member = guild.members.cache.find(mem => mem.id === newMember.id);
            let role = guild.roles.cache.find(ro => ro.id === r.extRoleID);
            member.roles.remove(role).catch(err => console.log('err ' + err));
            member.guild.channels.cache.find(c => c.name === 'bot-ops').send(member.user.username + ' removed role ' + role.name + ' by ' + newMember.guild.name);
            sql = mysql.format('DELETE FROM rolesGranted WHERE rolesyncID = ? AND memberID = ?',[
                r.syncID,
                member.id,
            ]);
            con.query(sql, function(err, res) {
              if (err) throw err;
            });
            if(role.name === 'Bee') {
              let localLogChannel = member.guild.channels.cache.find(c => c.name === 'bot-ops');
              if(member.kickable) {
                member.send('Thank you for your interest in Pantheon Industry Discord. Unfortunately you need to have roles in the Main Pantheon Discord prior to joining the Industrial Discord. Once you are given roles in the Main Pantheon Discord, please feel free to come back over.');
                member.kick('Does not have any roles');
                localLogChannel.send(member.user.username + ' was not matched to any roles and was kicked');
              }
              else {
                localLogChannel.send(member.user.username + ' had bee role removed and should be kicked');
              }
            }
          }
          else if(type === "internal" && !oldRoles.some(ro => ro === r.roleID) && newRoles.some(ro => ro === r.roleID) && extServerMember.manageable) {
            let guild = client.guilds.cache.find(guild => guild.id === r.id);
            let member = guild.members.cache.find(mem => mem.id === newMember.id);
            let role = guild.roles.cache.find(ro => ro.id === r.extRoleID);
            member.roles.add(role).catch(err => console.log('err ' + err));
            member.guild.channels.cache.find(c => c.name === 'bot-ops').send(member.user.username + ' granted role ' + role.name + ' by ' + newMember.guild.name);
            sql = mysql.format('INSERT INTO rolesGranted (memberID, rolesyncID) VALUES (?, ?)', [
              member.id,
              r.syncID,
            ]);
            con.query(sql, function(err, res) {
              if (err) throw err;
            });
          }
          else if(type === "external" && oldRoles.some(ro => ro === r.extRoleID) && !newRoles.some(ro => ro === r.extRoleID) && mainServerMember.manageable) {
            let guild = client.guilds.cache.find(guild => guild.id === mainServerID);
            let member = guild.members.cache.find(mem => mem.id === newMember.id);
            let role = guild.roles.cache.find(ro => ro.id === r.roleID);
            member.roles.remove(role).catch(err => console.log('err ' + err));
            logChannel.send(member.user.username + ' removed role ' + role.name + ' by ' + newMember.guild.name);
            sql = mysql.format('DELETE FROM rolesGranted WHERE rolesyncID = ? AND memberID = ?', [
              r.syncID,
              member.id,
            ]);
            con.query(sql, function(err, res) {
              if (err) throw err;
            });
          }
          else if(type === "external" && !oldRoles.some(ro => ro === r.extRoleID) && newRoles.some(ro => ro === r.extRoleID) && mainServerMember.manageable) {
            let guild = client.guilds.cache.find(guild => guild.id === mainServerID);
            let member = guild.members.cache.find(mem => mem.id === newMember.id);
            let role = guild.roles.cache.find(ro => ro.id === r.roleID);
            member.roles.add(role).catch(err => console.log('err ' + err));
            logChannel.send(member.user.username + ' granted role ' + role.name + ' by ' + newMember.guild.name);
            sql = mysql.format('INSERT INTO rolesGranted (memberID, rolesyncID) VALUES (?, ?)', [
              member.id,
              r.syncID,
            ]);
            con.query(sql, function(err, res) {
              if (err) throw err;
            });
          }
        }
      });
      con.release();
    });
  });
};

module.exports = createGuildMemberUpdateHandler;
