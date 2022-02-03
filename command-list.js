const hello = require('./commands/hello');
const verify = require('./commands/verify');
const onetime = require('./commands/onetime');


const commandList = [
  {
    name: 'hello',
    execute: hello,
  },
  {
    name: 'verify',
    execute: verify,
  },
  {
    name: 'onetime',
    execute: onetime,
  }
];

module.exports = commandList;
