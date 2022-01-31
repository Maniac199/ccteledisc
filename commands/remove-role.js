const mysql = require('mysql');

const removeRole = (context) => {
  const { message, configuration, logChannel, database, args } = context;
  const { mainServerID, botLogsChannel } = configuration;
  const { guild, channel } = message;

  if (guild.id !== mainServerID || channel.id !== botLogsChannel) {
    return;
  }
  database.getConnection((err, con) => {
    const select = mysql.format('SELECT * FROM mainRoles WHERE roleName = ?', [
      args[0],
    ]);
    con.query(select, (err, result) => {
      if (err) {
        throw err;
      }
      if (result.length > 0) {
        const del = mysql.format('DELETE FROM mainRoles WHERE roleName = ?', [
          args[0],
        ]);
        con.query(del, (err, result) => {
          if (err) {
            throw err;
          }
          logChannel.send(args[0] + ' role removed from role sync.');
        });
      } else {
        logChannel.send(args[0] + ' role not found in role sync.');
      }
    });
    con.release();
  });
};

module.exports = removeRole;
