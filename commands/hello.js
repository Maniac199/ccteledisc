
const hello = ctx => {
  console.log('entered hello');
  ctx.reply('Please respond with: $verify lookup email postcode/zipcode. For example:\\n$verify lookup billing@cryptocache.tech 12345');

};

module.exports = hello;
