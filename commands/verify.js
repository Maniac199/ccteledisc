const mysql = require('mysql');

const verify = (context) => {
    const { message, configuration, billingDB, botDB, botCache, args, client} = context;
    const { mainServerID, botLogsChannel, ccpRoleID, botListenChannel} = configuration;
    const { guild, channel } = message;
    let testmode = false;
    let lookup = false;
    let email, zip;
    let theGuild = client.guilds.cache.find(g => g.id === mainServerID);
    let ccpRole = theGuild.roles.cache.find(r => r.id === ccpRoleID);
    let theMem = theGuild.members.cache.find(m => m.id === message.author.id);
    if(guild) {
        if (guild.id !== mainServerID || (channel.id !== botLogsChannel && channel.id !== botListenChannel)) {
            return;
        }
    }
    if(args[0]) {
        if(args[0] === 'test') {
            testmode = true;
            message.reply('Proceeding in test mode');
        }
        else if(args.length === 3 && args[0] === 'lookup') {
            lookup = true;
            email = args[1];
            zip = args[2];
        }
    }
    if(botCache.indexOf(message.author.id) > 0) {
        message.reply('Already verified.');
    }
    else if (!lookup){
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
                        message.reply('Access has been granted');
                    }
                } else {
                    message.reply(message.author.username + ' I will continue the verification process via PM!');
                    message.author.send('Please respond with: $verify lookup email postcode/zipcode. For example:\n$verify lookup billing@cryptocache.tech 12345');
                }
            });
            con.release();
        });
    }
    else if(lookup) {
        message.reply('Standby, looking up the information provided.');
        let valSub = mysql.format("SELECT * FROM pxg_wc_customer_lookup LEFT JOIN pxg_wc_order_product_lookup ON pxg_wc_customer_lookup.customer_id = pxg_wc_order_product_lookup.customer_id LEFT JOIN pxg_postmeta ON pxg_wc_order_product_lookup.order_id = pxg_postmeta.post_id WHERE post_id IN ( SELECT meta_value FROM pxg_postmeta WHERE post_id IN ( SELECT post_id FROM pxg_postmeta WHERE meta_key = ?) AND meta_key = ?) AND meta_key = ? AND meta_value = ? AND postcode = ?",
            [
                '_subscription_id',
                '_order_id',
                '_billing_email',
                email,
                zip
            ]);
        billingDB.getConnection((err, con) => {
            con.query(valSub, (err, subResults) => {
                if (err) {
                    throw (err);
                }
                if (subResults.length > 0) {
                    message.reply('Account located, granting access');
                    theMem.roles.add(ccpRole).catch((err) => context.logger.error(err.message));
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
                } else {
                    message.reply('Unable to locate account');
                }
            });
        });
    }
};

module.exports = verify;
