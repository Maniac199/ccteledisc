const mysql = require('mysql');

const verify = (context) => {
    const { message, configuration, billingDB } = context;
    const { mainServerID, botLogsChannel } = configuration;
    const { guild, channel } = message;

    if (guild.id !== mainServerID || channel.id !== botLogsChannel) {
        return;
    }

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
            if (subResults.length > 0) {
                message.reply(message.author.username + ' You have been verified, granting access!');
            }
            else {
                message.reply(message.author.username + ' I will continue the verification process via PM!');
                message.author.send('Please enter your email address that you registered with.');
            }
        });
        con.release();
    });
};

module.exports = verify;
