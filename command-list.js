const hello = require('./commands/hello');
const verify = require('./commands/verify');


const commandList = [
  {
    name: 'hello',
    execute: hello,
  },
  {
    name: 'verify',
    execute: verify,
  },
];

module.exports = commandList;
