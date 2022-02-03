const mysql = require('mysql');

module.exports = (configuration) => {
  const billingDB = mysql.createPool({
    connectionLimit: 10,
    host: configuration.databaseHost,
    user: configuration.databaseUser,
    password: configuration.databasePassword,
    database: configuration.databaseName,
  });
  const botDB = mysql.createPool({
    connectionLimit: 10,
    host: configuration.databaseHost,
    user: configuration.databaseUser,
    password: configuration.databasePassword,
    database: configuration.databaseName,
  });
  return {billingDB, botDB};
};
