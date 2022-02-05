const mysql = require('mysql');

const onetime =(context) => {
    const {client, message, configuration, billingDB, botCache} = context;
    const {mainServerID, botLogsChannel} = configuration;
    const {guild, channel} = message;
    if (guild.id !== mainServerID || channel.id !== botLogsChannel) {
        return;
    }
    let validated = 0;
    billingDB.getConnection((err, con) => {
        console.log('bot cache: ' + botCache.length);
        let membersArray = [];

        let theGuild = client.guilds.cache.find(g => g.id === mainServerID);
        let theMembers = theGuild.members.cache;
        theMembers.forEach(mem => {
            membersArray.push(mem.user.tag);
        });
        message.reply('Found ' + membersArray.length + ' members in the server.');
        for (let i of membersArray) {
            let valSub = mysql.format("SELECT * FROM pxg_wc_customer_lookup LEFT JOIN pxg_wc_order_product_lookup ON pxg_wc_customer_lookup.customer_id = pxg_wc_order_product_lookup.customer_id LEFT JOIN pxg_postmeta ON pxg_wc_order_product_lookup.order_id = pxg_postmeta.post_id WHERE post_id IN ( SELECT meta_value FROM pxg_postmeta WHERE post_id IN ( SELECT post_id FROM pxg_postmeta WHERE meta_key = ?) AND meta_key = ?) AND meta_key = ? AND meta_value = ?",
                [
                    '_subscription_id',
                    '_order_id',
                    'discord',
                    i
                ]);
            let tester = 0;
            con.query(valSub, (err, subResults) => {
                if (err) {
                    throw (err);
                }
                if (subResults.length > 0 && tester === 0) {
                    console.log('validated ' + i);
                    if(botCache.indexOf(i)) {
                        console.log('Found in botCache, moving to next');
                    }
                    else {
                        console.log(subResults);
                        tester++;
                    }
                }

            });
        }
        con.release();
        message.reply('validated ' + validated + ' members');
    });
}

module.exports = onetime;