const mysql = require('mysql');

const onetime = (context) => {
    const {client, message, configuration, billingDB} = context;
    const {mainServerID, botLogsChannel} = configuration;
    const {guild, channel} = message;

    if (guild.id !== mainServerID || channel.id !== botLogsChannel) {
        return;
    }

    billingDB.getConnection(async (err, con) => {
    let theGuild = client.guilds.cache.find(g => g.id === mainServerID);
    let validated = 0;
    let invalid = 0;
        if(theGuild) {
            let theMembers = theGuild.members.cache;
            let membersArray = [];
            for await (let m of theMembers) {
                let theMem = client.users.cache.find(mid => mid.id === m.id);
                console.log(theMem.tag);

            }
            console.log('membersArray size: ' + membersArray.length);
            message.reply('Found ' + membersArray.length + ' members in the server.');
            for(let i = 0; i < membersArray.length; i ++) {
                let valSub = mysql.format("SELECT * FROM pxg_wc_customer_lookup LEFT JOIN pxg_wc_order_product_lookup ON pxg_wc_customer_lookup.customer_id = pxg_wc_order_product_lookup.customer_id LEFT JOIN pxg_postmeta ON pxg_wc_order_product_lookup.order_id = pxg_postmeta.post_id WHERE post_id IN ( SELECT meta_value FROM pxg_postmeta WHERE post_id IN ( SELECT post_id FROM pxg_postmeta WHERE meta_key = ?) AND meta_key = ?) AND meta_key = ? AND meta_value = ?",
                    [
                        '_subscription_id',
                        '_order_id',
                        'discord',
                        membersArray[i]
                    ]);
                console.log('MYSQL QUERY: ' +valSub);
                con.query(valSub, async (err, subResults) => {
                    if (err) {
                        throw (err);
                    }
                    if (subResults.length > 0) {
                        validated++;
                        console.log('validated ' + membersArray[i]);
                    }
                    else {
                        invalid++;
                        console.log('not valid ' + membersArray[i]);
                    }
                });
            }
        }
        con.release();
        message.reply('validated ' + validated + ' members, ' + invalid + ' not validated');
    });
}

module.exports = onetime;