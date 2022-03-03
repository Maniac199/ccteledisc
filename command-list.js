const hello = require('./commands/hello');

const commandList = [
  {
    name: 'hello',
    execute: hello,
  }
];

module.exports = commandList;
