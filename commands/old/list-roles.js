const listRoles = (context) => {
  const { message, configuration, logChannel, database } = context;
  const { mainServerID, botLogsChannel } = configuration;
  const { guild, channel } = message;

  if (guild.id !== mainServerID || channel.id !== botLogsChannel) {
    return;
  }
  database.getConnection((err, con) => {
    const selectMainRoles = 'SELECT * FROM mainRoles';
    con.query(selectMainRoles, (err, result) => {
      if (err) {
        throw err;
      }
      if (result.length > 0) {
        let results = '*** Roles ***\n';
        result.forEach((role) => {
          results += role.roleName + '\n';
        });
        logChannel.send(results);
      } else {
        logChannel.send('No roles found.');
      }
    });
    con.release();
  });
};

module.exports = listRoles;
