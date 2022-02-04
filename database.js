const mysql = require('mysql');

module.exports = (configuration) => {
  const billingDB = mysql.createPool({
    connectionLimit: 10,
    host: configuration.billingDatabaseHost,
    user: configuration.billingDatabaseUser,
    password: configuration.billingDatabasePassword,
    database: configuration.billingDatabaseName,
    charset: "utf8mb4_unicode_520_ci",
  });
  const botDB = mysql.createPool({
    connectionLimit: 10,
    host: configuration.botDatabaseHost,
    user: configuration.botDatabaseUser,
    password: configuration.botDatabasePassword,
    database: configuration.botDatabaseName,
    charset: "utf8mb4_unicode_520_ci",
  });
  return {billingDB, botDB};
};
