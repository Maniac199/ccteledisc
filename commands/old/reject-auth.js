const mysql = require('mysql');

const rejectAuth = (context) => {
  const { client, configuration, logChannel, database, args } = context;
  const { botLogsChannelName } = configuration;

  if (args.length !== 1) {
    return;
  }
  database.getConnection((err, con) => {
    const select = mysql.format('SELECT * FROM pendingAuth WHERE id = ?', [
      args,
    ]);
    con.query(select, (err, pending) => {
      if (err) {
        throw err;
      }
      if (pending.length > 0) {
        const del = mysql.format('DELETE FROM pendingAuth WHERE id = ?', [
          args,
        ]);
        con.query(del, (err, result) => {
          if (err) {
            throw err;
          }
          logChannel.send('Rejected request: ' + args);
          const reportChannel = client.guilds.cache
            .find((guild) => guild.id === pending[0].serverID)
            .channels.cache.find(
              (channel) => channel.name === botLogsChannelName
            );
          reportChannel.send('Your server has been denied authorization.');
        });
      } else {
        logChannel.send('Invalid authorization request.');
      }
    });
    con.release();
  });
};

module.exports = rejectAuth;
