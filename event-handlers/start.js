const createStartHandler = ctx => {
  if(!ctx.message.from.is_bot) {
    ctx.reply('Request acknowledged, I have started a private chat with you.');
    ctx.telegram.sendMessage(ctx.message.from.id, "Hello, I am the verification bot for CryptoCache Premium. I will walk you through the verification process. Please respond with: $verify lookup email postcode/zipcode. For example:\n$verify lookup billing@cryptocache.tech 12345");
  }
};

module.exports = { createStartHandler };
