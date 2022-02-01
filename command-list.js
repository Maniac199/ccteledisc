const addRole = require('./commands/add-role');
const hello = require('./commands/hello');



const commandList = [
  /*{
    name: 'addRole',
    execute: addRole,
  }*/
  {
    name: 'hello',
    execute: hello,
  }
];

module.exports = commandList;
