const mysql = require('mysql');

const onetime = async (context) => {
    const {client, message, configuration, billingDB, botDB, botCache} = context;
    const {mainServerID, botLogsChannel} = configuration;
    const {guild, channel} = message;
    if (guild.id !== mainServerID || channel.id !== botLogsChannel) {
        return;
    }
    let validated = 0;
    billingDB.getConnection(async(err, con) => {
        message.reply('bot cache: ' + botCache.length);
        let membersArray = [];

        let theGuild = client.guilds.cache.find(g => g.id === mainServerID);
        let theMembers = theGuild.members.cache;
        for await (let tm of theMembers) {
            membersArray.push(tm.user.tag);
        }

        message.reply('Found ' + membersArray.length + ' members in the server.');
        for await (let i of membersArray) {
            let valSub = mysql.format("SELECT * FROM pxg_wc_customer_lookup LEFT JOIN pxg_wc_order_product_lookup ON pxg_wc_customer_lookup.customer_id = pxg_wc_order_product_lookup.customer_id LEFT JOIN pxg_postmeta ON pxg_wc_order_product_lookup.order_id = pxg_postmeta.post_id WHERE post_id IN ( SELECT meta_value FROM pxg_postmeta WHERE post_id IN ( SELECT post_id FROM pxg_postmeta WHERE meta_key = ?) AND meta_key = ?) AND meta_key = ? AND meta_value = ?",
                [
                    '_subscription_id',
                    '_order_id',
                    'discord',
                    i
                ]);

            con.query(valSub, (err, subResults) => {
                if (err) {
                    throw (err);
                }
                if (subResults.length > 0) {
                    console.log('validated ' + i);
                    let theMem = theGuild.members.cache.find(m => m.tag = i);
                    if(botCache.indexOf(theMem.id) > 0) {
                        console.log('Found in botCache, moving to next');
                    }
                    else {
                        console.log(subResults[0].order_id);
                        botDB.getConnection(async (err, botcon) => {
                            let botIns = mysql.format('INSERT INTO discord (discord_tag, discord_id, order_id) VALUES (?, ?, ?)',
                                [
                                    i,
                                    theMem.id,
                                    subResults[0].order_id
                                ]);
                            botcon.query(botIns, (err, r) => {
                                if(err) {
                                    throw (err);
                                }
                                else {
                                    botCache.push(theMem.id);
                                    console.log(i + ' added to bot database');
                                }
                            })
                        });

                    }
                }

            });
        }
        con.release();
        message.reply('validated ' + validated + ' members');
    });
}

module.exports = onetime;