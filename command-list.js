const addRole = require('./commands/add-role');
const grantAuth = require('./commands/grant-auth');
const rejectAuth = require('./commands/reject-auth');
const removeRole = require('./commands/remove-role');
const requestAuth = require('./commands/request-auth');
const listRoles = require('./commands/list-roles');
const listApprovedRoles = require('./commands/list-approved-roles');
const help = require('./commands/help');
const removeRoleSync = require('./commands/remove-role-sync');
const verifyRoles = require('./commands/verify-roles');
const processBuffer = require('./commands/process-buffer');
const verifyNicks = require('./commands/verify-nicks');


const commandList = [
  {
    name: 'auth',
    execute: requestAuth,
  },
  {
    name: 'grant',
    execute: grantAuth,
  },
  {
    name: 'reject',
    execute: rejectAuth,
  },
  {
    name: 'addRole',
    execute: addRole,
  },
  {
    name: 'removeRole',
    execute: removeRole,
  },
  {
    name: 'listRoles',
    execute: listRoles,
  },
  {
    name: 'listApprovedRoles',
    execute: listApprovedRoles,
  },
  {
    name: 'removeRoleSync',
    execute: removeRoleSync,
  },
  {
    name: 'help',
    execute: help,
  },
  {
    name: 'verifyRoles',
    execute: verifyRoles,
  },
  {
    name: 'processBuffer',
    execute: processBuffer,
  },
  {
    name: 'verifyNicks',
    execute: verifyNicks,
  }
];

module.exports = commandList;
