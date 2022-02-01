const help = (context) => {
  const { message } = context;
  let response = '** Bee Keeper Commands ** \n\n';

  response +=
    'To setup Bee Keeper, please create a channel in your discord server called bot-ops and make sure the bot has access to it. All commands and logs will be placed there. Please be mindful of not using spaces unless one is needed such as for a role name. Once that channel is created, a Pantheon admin will provide you with the auth commands to run below: \n \n';

  response += '** $auth,type,mainRole,yourRole **\n';
  response +=
    '*** type *** = [internal, external] internal is for Pantheon controlled servers, external is for externally controlled servers. If you have questions, a Pantheon admin will assist you. \n';
  response +=
    '*** mainRole *** = Name of the role in the main server you are wanting to sync to. If you do not know, a Pantheon admin can assist you. \n';
  response +=
    '*** yourRole *** = Name of the role in your server that maps to the mainRole. \n\n';

  response +=
    'Once a request for auth has been made, it must be approved by a Pantheon admin. Once the request is approved or rejected, you will be informed via your bot-ops channel. \n\n';

  response += '** $grant,## ** \n';
  response +=
    '*** ## *** = Number associated with the auth request. This command will grant the role sync. \n';
  response += '** $reject,## ** \n';
  response +=
    '*** ## *** = Number associated with the auth request. This command will reject the role sync. \n\n';

  response += '** $listRoles ** \n';
  response +=
    'Lists all current roles in main server approved for synchronization. \n\n';
  response += '** $addRole,role ** \n';
  response += '*** role *** = name of role to add to authorized list. \n\n';
  response += '** $removeRole,role ** \n';
  response +=
    '*** role *** = name of role to remove from authorized list. \n\n';

  response += '** $listApprovedRoles ** \n';
  response += 'Lists all current role syncs approved for synchronization. \n\n';
  response += '** $removeRoleSync,syncID ** \n';
  response +=
    '*** syncID *** = ID associated with the role sync which can be found using !listApprovedRoles. \n\n';

  message.reply(response);
};

module.exports = help;
