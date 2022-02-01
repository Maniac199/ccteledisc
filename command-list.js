const addRole = require('./commands/add-role');



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
