const listApprovedRoles = (context) => {
  const { message, configuration, logChannel, database } = context;
  const { mainServerID, botLogsChannel } = configuration;
  const { guild, channel } = message;

  if (guild.id !== mainServerID || channel.id !== botLogsChannel) {
    return;
  }
  database.getConnection((err, con) => {
    const select =
      'SELECT * FROM approvedServers LEFT JOIN mainRoles ON approvedServers.roleID = mainRoles.roleID ORDER BY name';
    con.query(select, (err, result) => {
      if (err) {
        throw err;
      }
      if (result.length > 0) {
        let results = '*** Roles ***\n';
        result.forEach((res) => {
          if (res.type === 'internal') {
            results +=
              res.syncID +
              ' - Main Server: ' +
              res.roleName +
              ' >>> ' +
              unescape(res.name) +
              ': ' +
              res.extRoleName +
              '\n';
          } else {
            results +=
              res.syncID +
              ' - Main Server: ' +
              res.roleName +
              ' <<< ' +
              unescape(res.name) +
              ': ' +
              res.extRoleName +
              '\n';
          }
        });
        logChannel.send(results, { split: true });
      } else {
        logChannel.send('No roles found.');
      }
    });
    con.release();
  });
};

module.exports = listApprovedRoles;
