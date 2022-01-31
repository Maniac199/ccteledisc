const mysql = require('mysql');

const removeRoleSync = (context) => {
  const {
    client,
    message,
    configuration,
    logChannel,
    database,
    args,
  } = context;
  const { mainServerID, botLogsChannel } = configuration;
  const { guild, channel } = message;

  if (guild.id !== mainServerID || channel.id !== botLogsChannel) {
    return;
  }
  database.getConnection((err, con) => {
    const select = mysql.format(
      'SELECT * FROM approvedServers WHERE syncID = ?',
      [args[0]]
    );
    con.query(select, (err, result) => {
      if (err) {
        throw err;
      }
      if (result.length > 0) {
        const deleteStatement = mysql.format(
          'DELETE FROM approvedServers WHERE syncID = ?',
          [args[0]]
        );
        con.query(deleteStatement, (err, del) => {
          if (err) {
            throw err;
          }
          logChannel.send('ID: ' + args[0] + ' sync removed.');
          const getRoleStatement = mysql.format(
            'SELECT * FROM rolesGranted WHERE rolesyncID = ?',
            [args[0]]
          );
          con.query(getRoleStatement, (err, results) => {
            if (err) {
              throw err;
            }
            let guild;
            if (result[0].type === 'external') {
              guild = client.guilds.cache.find((g) => g.id === mainServerID);
            } else {
              guild = client.guilds.cache.find((g) => g.id === result[0].id);
            }
            let role = guild.roles.cache.find(
              (ro) => ro.id === result[0].roleID
            );
            results.forEach((r) => {
              let member = guild.members.cache.find((m) => m.id === r.memberID);
              if (
                member.roles.cache.some((ro) => ro.id === result[0].roleID) &&
                member.isManageable
              ) {
                member.roles
                  .remove(role)
                  .catch((err) => context.logger.error(err.message));
              }
            });
          });
          const deleteRoleStatement = mysql.format(
            'DELETE FROM rolesGranted WHERE rolesyncID = ?',
            [args[0]]
          );
          con.query(deleteRoleStatement, (err, del) => {
            if (err) {
              throw err;
            }
          });
        });
      } else {
        logChannel.send('ID: ' + args[0] + ' not found.');
      }
    });
    con.release();
  });
};

module.exports = removeRoleSync;
