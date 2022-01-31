const mysql = require('mysql');

const addRole = (context) => {
  const { message, configuration, logChannel, database, args } = context;
  const { mainServerID, botLogsChannel } = configuration;
  const { guild, channel } = message;

  if (guild.id !== mainServerID || channel.id !== botLogsChannel) {
    return;
  }
  const role = guild.roles.cache.find((role) => role.name === args[0]);
  if (role) {
    database.getConnection((err, con) => {
      const query = mysql.format('SELECT * FROM mainRoles WHERE roleID = ?', [
        role.id,
      ]);

      con.query(query, (err, result) => {
        if (err) {
          throw err;
        }
        if (result.length > 0) {
          logChannel.send(args[0] + ' role already added');
        } else {
          const insert = mysql.format(
            'INSERT INTO mainRoles (roleID, roleName) VALUES (?, ?)',
            [role.id, role.name]
          );
          con.query(insert, (err, result) => {
            if (err) {
              throw err;
            }
            logChannel.send('Added ' + args[0] + ' role to rolesync');
          });
        }
        con.release();
      });
    });
  } else {
    logChannel.send('Role ' + args[0] + ' not found');
  }
};

module.exports = addRole;
