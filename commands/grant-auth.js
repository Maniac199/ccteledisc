const mysql = require('mysql');

const grantAuth = (context) => {
  const { client, configuration, logChannel, database, args } = context;
  const { botLogsChannelName } = configuration;

  database.getConnection((err, con) => {
    const query = mysql.format('SELECT * FROM pendingAuth WHERE id = ?', [
      args,
    ]);
    con.query(query, (err, pending) => {
      if (err) {
        throw err;
      }
      if (pending.length > 0) {
        const insert = mysql.format(
          'INSERT INTO approvedServers (id, name, type, roleID, extRoleID, extRoleName) VALUES (?,?,?,?,?,?)',
          [
            pending[0].serverID,
            pending[0].serverName,
            pending[0].type,
            pending[0].roleID,
            pending[0].extRoleID,
            pending[0].extRoleName,
          ]
        );
        con.query(insert, (err, result) => {
          if (err) {
            throw err;
          }
          const del = mysql.format('DELETE FROM pendingAuth WHERE id = ?', [
            args,
          ]);
          con.query(del, (err, results) => {
            logChannel.send(
              unescape(pending[0].serverName) +
                ' has been added as an ' +
                pending[0].type +
                ' server.'
            );
          });
        });
      }
      con.release();

      const reportChannel = client.guilds.cache
        .find((guild) => guild.id === pending[0].serverID)
        .channels.cache.find((channel) => channel.name === botLogsChannelName);

      reportChannel.send(
        'Your server sync request for role ' +
          pending[0].extRoleName +
          ' has been authorized.'
      );
    });
  });
};

module.exports = grantAuth;
