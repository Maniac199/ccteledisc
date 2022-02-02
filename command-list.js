const hello = require('./commands/hello');
const verify = require('./commands/verify');


const commandList = [
  /*{
    name: 'addRole',
    execute: addRole,
  }*/
  {
    name: 'hello',
    execute: hello,
  },
  {
    name: 'verify',
    execute: verify,
  }
];

module.exports = commandList;
