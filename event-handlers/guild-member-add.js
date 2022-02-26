const mysql = require('mysql');

const createGuildMemberAddHandler = (context) => (member) => {
    const { client, configuration, botDB, billingDB, botCache } = context;
    const { mainServerID, botLogsChannel, ccpRoleID } = configuration;

    let theGuild = client.guilds.cache.find(g => g.id === mainServerID);
    let ccpRole = theGuild.roles.cache.find(r => r.id === ccpRoleID);
    let theMem = theGuild.members.cache.find(m => m.id === member.user.id);
    let logChan = theGuild.channels.cache.find(c => c.id === botLogsChannel);
    let nonPremRole = theGuild.roles.cache.find(n => n.id === 'Non-premium');
    let unverified = theGuild.roles.cache.find(m => m.name === 'Unverified');
    billingDB.getConnection((err, con) => {
        if(botCache.indexOf(member.id) > 0) {
            verified(theMem, false, member, botDB, botCache, false, ccpRole, context, nonPremRole, unverified);
            console.log(member.user.tag + ' was verified via botCache');
            logChan.send(member.user.tag + ' was verified via botCache');
            //console.log(nonPremRole);
            //console.log(unverified);
        }
        else {
          let valSub = mysql.format("SELECT * FROM pxg_wc_customer_lookup LEFT JOIN pxg_wc_order_product_lookup ON pxg_wc_customer_lookup.customer_id = pxg_wc_order_product_lookup.customer_id LEFT JOIN pxg_postmeta ON pxg_wc_order_product_lookup.order_id = pxg_postmeta.post_id WHERE post_id IN ( SELECT meta_value FROM pxg_postmeta WHERE post_id IN ( SELECT post_id FROM pxg_postmeta WHERE meta_key = ?) AND meta_key = ?) AND meta_key = ? AND meta_value = ?",
              [
                '_subscription_id',
                '_order_id',
                'discord',
                member.user.tag
              ]);
            con.query(valSub, (err, subResults) => {
                if (err) {
                    throw (err);
                }
                if (subResults.length > 0) {
                    verified(theMem, true, member, botDB, botCache, subResults, ccpRole, context, nonPremRole, unverified);
                    console.log(member.user.tag + ' was verified via subscription');
                    logChan.send(member.user.tag + ' was verified via subscription');
                }
                else {
                    member.user.send('I was unable to verify your premium status. If you are a premium subscriber, please respond with: $verify lookup email postcode/zipcode. For example:\\n$verify lookup billing@cryptocache.tech 12345');
                    console.log(member.user.tag + ' was not able to be verified automatically');
                    logChan.send(member.user.tag + ' was not able to be verified automatically');
                }
            });
        }
    con.release();
    });
};

const verified = (theMem, toBot, member, botDB, botCache, subResults, ccpRole, context, nonPremRole, unverified) => {
    setTimeout(function() {
        theMem.roles.add(ccpRole).catch((err) => context.logger.error(err.message));
        setTimeout(function() {
            theMem.roles.remove(nonPremRole).catch((err) => context.logger.error(err.message));
            setTimeout(function() {
                theMem.roles.remove(unverified).catch((err) => context.logger.error(err.message));
                member.send('You have been automatically verified and granted access!');
                if (toBot) {
                    botDB.getConnection(async (err, botcon) => {
                        let botIns = mysql.format('INSERT INTO discord (discord_tag, discord_id, order_id) VALUES (?, ?, ?)',
                            [
                                theMem.user.tag,
                                theMem.id,
                                subResults[0].order_id
                            ]);
                        botcon.query(botIns, (err, r) => {
                            if (err) {
                                throw (err);
                            } else {
                                botCache.push(theMem.id);
                            }
                        });
                        botcon.release();
                    });
                }
            }, 2000);
        }, 2000);
    }, 5000);
}
module.exports = createGuildMemberAddHandler;
