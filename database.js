const mysql = require('mysql');

module.exports = (configuration) => {
  const billingDB = mysql.createPool({
    connectionLimit: 10,
    host: configuration.billingDatabaseHost,
    user: configuration.billingDatabaseUser,
    password: configuration.billingDatabasePassword,
    database: configuration.billingDatabaseName,
  });
  const botDB = mysql.createPool({
    connectionLimit: 10,
    host: configuration.botDatabaseHost,
    user: configuration.botDatabaseUser,
    password: configuration.botDatabasePassword,
    database: configuration.botDatabaseName,
  });
  return {billingDB, botDB};
};
