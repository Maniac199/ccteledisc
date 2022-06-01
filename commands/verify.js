const mysql = require('mysql');

const verify = (context) => {
    const { message, configuration, billingDB, botDB, args, client, ctx} = context;
    const { mainServerID, botLogsChannel, teleprem, teleswing} = configuration;
    //const { guild, channel } = message;
    //let testmode = false;
    let email, zip;
    let theGuild = client.guilds.cache.find(g => g.id === mainServerID);
    //let ccpRole = theGuild.roles.cache.find(r => r.id === ccpRoleID);
    //let theMem = theGuild.members.cache.find(m => m.id === message.author.id);
    let logChan = theGuild.channels.cache.find(c => c.id === botLogsChannel);
   // let nonPremRole = theGuild.roles.cache.find(n => n.name === 'Non-premium');
   // let unverified = theGuild.roles.cache.find(m => m.name === 'Unverified');
   /* if(guild) {
        if (guild.id !== mainServerID || (channel.id !== botLogsChannel && channel.id !== botListenChannel)) {
            //console.log('exited from verify');
            return;
        }
    }*/
    if(args[0]) {
        if(args[0] === 'test') {
            //testmode = true;
            message.reply('Proceeding in test mode');
        }
        if(args[0] === 'test') {
            testmode = true;
            message.reply('Proceeding in test mode');
        }
        if(args.length === 2 && (args[0] === 'lookup' || args[0] === 'test')) {

            email = args[1];
            zip = '';
        }
        else if(args.length === 3 && (args[0] === 'lookup' || args[0] === 'test')) {

            email = args[1];
            zip = args[2];
        }
        else if(args.length === 4 && (args[0] === 'lookup' || args[0] === 'test')) {

            email = args[1];
            zip = args[2] + args[3];
        }
    }
    else {
        args[0] = '';
    }
    /*if(botCache.indexOf(message.author.id) > 0) {
        message.reply('Already verified.');
        logChan.send(message.author.tag + ' used ' + message.content + ' but was already verified');
    }*/
    /*if (args[0] !== 'lookup'){
        billingDB.getConnection((err, con) => {
            let valSub = mysql.format("SELECT * FROM pxg_wc_customer_lookup LEFT JOIN pxg_wc_order_product_lookup ON pxg_wc_customer_lookup.customer_id = pxg_wc_order_product_lookup.customer_id LEFT JOIN pxg_postmeta ON pxg_wc_order_product_lookup.order_id = pxg_postmeta.post_id WHERE post_id IN ( SELECT meta_value FROM pxg_postmeta WHERE post_id IN ( SELECT post_id FROM pxg_postmeta WHERE meta_key = ?) AND meta_key = ?) AND meta_key = ? AND meta_value = ?",
                [
                    '_subscription_id',
                    '_order_id',
                    'discord',
                    message.author.tag
                ]);
            con.query(valSub, (err, subResults) => {
                if (err) {
                    throw (err);
                }
                if (subResults.length > 0 && !testmode) {
                    message.reply(message.author.username + ' You have been verified, granting access!');
                    logChan.send(message.author.tag + ' used the ' + message.content + ' command and was granted access');
                    if(ccpRole.members.find(m => m.id === message.author.id)) {
                        message.reply('Access has been verified');
                    }
                    else {

                        let valSub = mysql.format("SELECT * FROM pxg_wc_customer_lookup LEFT JOIN pxg_wc_order_product_lookup ON pxg_wc_customer_lookup.customer_id = pxg_wc_order_product_lookup.customer_id LEFT JOIN pxg_postmeta ON pxg_wc_order_product_lookup.order_id = pxg_postmeta.post_id WHERE post_id IN ( SELECT meta_value FROM pxg_postmeta WHERE post_id IN ( SELECT post_id FROM pxg_postmeta WHERE meta_key = ?) AND meta_key = ?) AND meta_key = ? AND meta_value = ?",
                            [
                                '_subscription_id',
                                '_order_id',
                                'discord',
                                theMem.user.tag
                            ]);
                        con.query(valSub, (err, subResults) => {
                            if (err) {
                                throw (err);
                            }
                            if(subResults.length > 0) {
                                botDB.getConnection(async (err, botcon) => {
                                    let botIns = mysql.format('INSERT INTO discord (discord_tag, discord_id, order_id) VALUES (?, ?, ?)',
                                        [
                                            theMem.user.tag,
                                            theMem.id,
                                            subResults[0].order_id
                                        ]);
                                    botcon.query(botIns, (err, r) => {
                                        if(err) {
                                            throw (err);
                                        }
                                        else {
                                            botCache.push(theMem.id);
                                        }
                                    });
                                    botcon.release();
                                });
                            }
                        });
                        theMem.roles.add(ccpRole).catch((err) => context.logger.error(err.message));
                        theMem.roles.remove(nonPremRole).catch((err) => context.logger.error(err.message));
                        theMem.roles.remove(unverified).catch((err) => context.logger.error(err.message));
                        message.reply('Access has been granted');
                    }
                } else {
                    message.reply(message.author.username + ' I will continue the verification process via PM!');
                    message.author.send('Please respond with: $verify lookup email postcode/zipcode. For example:\n$verify lookup billing@cryptocache.tech 12345');
                    logChan.send(message.author.tag + ' used ' + message.content + ' and was not located');
                }
            });
            con.release();
        });
    }*/
    if(args[0] === 'lookup' && zip !== 12345) {
        ctx.reply('Standby, looking up the information provided.');
        let valSub = mysql.format("SELECT * FROM pxg_wc_customer_lookup LEFT JOIN pxg_wc_order_product_lookup ON pxg_wc_customer_lookup.customer_id = pxg_wc_order_product_lookup.customer_id LEFT JOIN pxg_postmeta ON pxg_wc_order_product_lookup.order_id = pxg_postmeta.post_id WHERE post_id IN ( SELECT meta_value FROM pxg_postmeta WHERE post_id IN ( SELECT post_id FROM pxg_postmeta WHERE meta_key = ?) AND meta_key = ?) AND meta_key = ? AND LOWER(meta_value) = ? AND REPLACE(LOWER(postcode), ' ', '') = ?",
            [
                '_subscription_id',
                '_order_id',
                '_billing_email',
                email.toLowerCase(),
                zip.toLowerCase().replace(/\s+/g, '')
            ]);
        billingDB.getConnection((err, con) => {
            con.query(valSub, async (err, subResults) => {
                if (err) {
                    throw (err);
                }
                if (subResults.length > 0) {
                    ctx.reply('Account located, generating links');
                    const date = Date.now() + (1000*60*60*4);
                    const options = {
                        member_limit: 1,
                        expire_date: date
                    }
                    //console.log(Date.now() + ' plus 1 hour: ' + date);
                    const premLink = await ctx.telegram.createChatInviteLink(teleprem, options);
                    const swingLink = await ctx.telegram.createChatInviteLink(teleswing, options);
                    logChan.send(ctx.message.from.username + ' used ' + ctx.message.text + ' and was granted access. Premium link: ' + premLink.invite_link + ' Swing link: ' + swingLink.invite_link);
                    ctx.reply("Please use these one time use links to access the channels:\nPremium: " + premLink.invite_link + "\nSwings: " + swingLink.invite_link);
                    botDB.getConnection(async (err, botcon) => {
                        let botIns = mysql.format('INSERT INTO telegram (telegram_user, telegram_id, order_id) VALUES (?, ?, ?)',
                            [
                                ctx.message.from.username,
                                ctx.message.from.id,
                                subResults[0].order_id
                            ]);
                        botcon.query(botIns, (err, r) => {
                            if(err) {
                                throw (err);
                            }
                        });
                        botcon.release();
                    });
                } else {
                    ctx.reply('Unable to locate account');
                    logChan.send(ctx.message.from.username + ' used ' + ctx.message.text + ' and was not granted access');
                }
            });
        });
    }
    else {
        ctx.reply("You sent an invalid request. \n\nPlease respond with: $verify lookup email postcode/zipcode. \n\nFor example:\n$verify lookup billing@cryptocache.tech 12345");
    }
};

module.exports = verify;
