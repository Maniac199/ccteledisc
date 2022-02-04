const mysql = require('mysql');

const onetime = async (context) => {
    const {client, message, configuration, billingDB} = context;
    const {mainServerID, botLogsChannel} = configuration;
    const {guild, channel} = message;
    if (guild.id !== mainServerID || channel.id !== botLogsChannel) {
        return;
    }

    billingDB.getConnection(async (err, con) => {
        let membersArray = [];
        let counter = 0;
        await memberList(membersArray, mainServerID, client);

        message.reply('Found ' + membersArray.length + ' members in the server.');
        for await (let i of membersArray) {
            let valSub = mysql.format("SELECT * FROM pxg_wc_customer_lookup LEFT JOIN pxg_wc_order_product_lookup ON pxg_wc_customer_lookup.customer_id = pxg_wc_order_product_lookup.customer_id LEFT JOIN pxg_postmeta ON pxg_wc_order_product_lookup.order_id = pxg_postmeta.post_id WHERE post_id IN ( SELECT meta_value FROM pxg_postmeta WHERE post_id IN ( SELECT post_id FROM pxg_postmeta WHERE meta_key = ?) AND meta_key = ?) AND meta_key = ? AND meta_value = ?",
                [
                    '_subscription_id',
                    '_order_id',
                    'discord',
                    i
                ]);
            await con.query(valSub, async (err, subResults) => {
                if (err) {
                    throw (err);
                }
                if (subResults.length > 0) {
                    counter++;
                    console.log('validated ' + i);
                }

            });
        }

        con.release();
        return counter;
    });
}

const memberList = (memArray, mainServerID, client) => {
    let theGuild = client.guilds.cache.find(g => g.id === mainServerID);
    let theMembers = theGuild.members.cache;
    theMembers.forEach(mem => {
        memArray.push(mem.user.tag);
    });
    return memArray;
}

module.exports = onetime;