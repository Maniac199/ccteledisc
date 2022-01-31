const mysql = require('mysql');

const createGuildMemberAddHandler = (context) => (member) => {
  const { client, message, configuration, logChannel, database, args } = context;
  const { mainServerID, botLogsChannel } = configuration;
  //const { guild, channel } = message;

  database.getConnection((err, con) => {
    var select = mysql.format(
      'SELECT * FROM approvedServers WHERE type = "internal" AND id = ?',
      [member.guild.id]
    );

    con.query(select, (err, internals) => {
      if (err) {
        throw err;
      }
      if (member.guild.id !== mainServerID && internals.length === 0) {
        return;
      }
      if (member.guild.id === mainServerID) {
        const selectExternalApprovedServers =
          'SELECT * FROM approvedServers WHERE type = "external"';
        con.query(selectExternalApprovedServers, (err, result) => {
          result.forEach((s) => {
            let guild = client.guilds.cache.find((guild) => guild.id === s.id);
            let memberCheck = guild.members.cache.find(
              (m) => m.id === member.id
            );
            if (memberCheck && member.manageable) {
              if (memberCheck.roles.cache.some((r) => r.id === s.extRoleID)) {
                let role = member.guild.roles.cache.find(
                  (r) => r.id === s.roleID
                );
                if (role) {
                  member.roles
                    .add(role)
                    .catch((err) => context.logger.error(err.message));
                  logChannel.send(
                    member.user.username +
                      ' granted role ' +
                      role.name +
                      ' by ' +
                      unescape(s.name)
                  );
                  const insert = mysql.format(
                    'INSERT INTO rolesGranted (memberID, rolesyncID) VALUES (?, ?)',
                    [member.id, s.syncID]
                  );
                  con.query(insert, (err, res) => {
                    if (err) {
                      throw err;
                    }
                  });
                }
              }
            }
          });
        });
      } else {
        let roleFound = false;
        internals.forEach((i) => {
          let guild = client.guilds.cache.find(
            (g) => g.id === mainServerID
          );
          let memberCheck = guild.members.cache.find(
            (mem) => mem.id === member.id
          );
          if (memberCheck) {
            if (
              memberCheck.roles.cache.some((r) => r.id === i.roleID) &&
              member.manageable
            ) {
              let role = member.guild.roles.cache.find(
                (r) => r.id === i.extRoleID
              );
              member.roles
                .add(role)
                .catch((err) => context.logger.error(err.message));
              roleFound = true;
              member.setNickname(memberCheck.nickname);
              member.guild.channels.cache
                .find((c) => c.name === 'bot-ops')
                .send(
                  member.user.username +
                    ' granted role ' +
                    role.name +
                    ' by ' +
                    guild.name +
                    ' and synchronized nickname to main server'
                );
              const insertGranteRoles = mysql.format(
                'INSERT INTO rolesGranted (memberID, rolesyncID) VALUES (?, ?)',
                [member.id, i.syncID]
              );
              con.query(insertGranteRoles, (err, res) => {
                if (err) {
                  throw err;
                }
              });
            }
          }
        });
        if(!roleFound && !member.user.bot && member.guild.id === '797212905065938974') {
          let localLogChannel = member.guild.channels.cache.find(c => c.name === 'bot-ops');
              if(member.kickable) {
                member.send('Thank you for your interest in Pantheon Industry Discord. Unfortunately you need to have roles in the Main Pantheon Discord prior to joining the Industrial Discord. Once you are given roles in the Main Pantheon Discord, please feel free to come back over.');
                member.kick('Does not have any roles');
                        localLogChannel.send(member.user.username + ' was not matched to any roles and was kicked');
              }
              else {
              localLogChannel.send(member.user.username + ' was not matched to any roles and should be kicked');
              }
        }
      }
    });
    con.release();
  });
};

module.exports = createGuildMemberAddHandler;
