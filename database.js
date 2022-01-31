const mysql = require('mysql');

module.exports = (configuration) => {
  const database = mysql.createPool({
    connectionLimit: 10,
    host: configuration.databaseHost,
    user: configuration.databaseUser,
    password: configuration.databasePassword,
    database: configuration.databaseName,
  });
  return database;
};
