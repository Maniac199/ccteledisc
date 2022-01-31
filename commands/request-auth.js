const mysql = require('mysql');

const requestAuth = (context) => {
  const {
    client,
    message,
    configuration,
    logChannel,
    database,
    args,
  } = context;
  const { mainServerID } = configuration;
  const { guild, author } = message;

  if (args.length === 3) {
    var role = client.guilds.cache
      .find((g) => g.id === mainServerID)
      .roles.cache.find((r) => r.name === args[1]);
    var localRole = guild.roles.cache.find((r) => r.name === args[2]);
    if (
      role &&
      localRole &&
      (args[0] === 'internal' || args[0] === 'external')
    ) {
      database.getConnection((err, con) => {
        const select = mysql.format(
          'SELECT * FROM approvedServers WHERE id = ? AND roleID = ? AND extRoleID = ?',
          [guild.id, role.id, localRole.id]
        );
        con.query(select, (err, appr) => {
          const getRolesStatement = mysql.format(
            'SELECT * FROM mainRoles WHERE roleID = ?',
            [role.id]
          );
          con.query(getRolesStatement, (err, perms) => {
            if (appr.length === 0 && perms.length > 0) {
              const selectPendingAuthStatement = mysql.format(
                'SELECT * FROM pendingAuth WHERE serverID = ? AND roleID = ?',
                [guild.id, role.id]
              );
              con.query(selectPendingAuthStatement, (err, result) => {
                if (err) {
                  throw err;
                }
                if (result.length > 0) {
                  message.reply(
                    'A request for authorization for that role has already been submitted and is pending approval. The request ID is: ' +
                      result[0].id
                  );
                } else {
                  let guildname = escape(guild.name)
                    .split('%20')
                    .join(' ')
                    .split('%27')
                    .join("'");

                  const insert = mysql.format(
                    'INSERT INTO pendingAuth (serverID, serverName, requestorID, requestorName, type, roleID, extRoleID, extRoleName) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [
                      guild.id,
                      guildname,
                      author.id,
                      author.username,
                      args[0],
                      role.id,
                      localRole.id,
                      localRole.name,
                    ]
                  );
                  con.query(insert, (err, result) => {
                    if (err) throw err;
                    message.reply(
                      'Requesting authorization, please wait. I will message you here when authorization is complete. Your request number is: ' +
                        result.insertId
                    );
                    logChannel.send(
                      'Authorization requested by ' +
                        author.username +
                        ' to add ' +
                        guild.name +
                        ' as an ' +
                        args[0] +
                        ' server to rolesync role: ' +
                        args[1] +
                        ' using external role of: ' +
                        localRole.name +
                        '.\nPlease enter $grant,' +
                        result.insertId +
                        ' to approve or $reject,' +
                        result.insertId +
                        ' to reject'
                    );
                  });
                }
              });
            } else if (appr.length > 0) {
              message.reply('Your server is already approved.');
            } else if (perms.length === 0) {
              message.reply('That role is not approved for sync at this time.');
            }
          });
        });
        con.release();
      });
    } else {
      message.reply(
        'Invalid use of !auth, please add arguements that will be provided by a Pantheon admin.'
      );
    }
  } else {
    message.reply(
      'Invalid use of !auth, please add arguements that will be provided by a Pantheon admin.'
    );
  }
};

module.exports = requestAuth;
