const { createLogger, format, transports } = require('winston');
const { combine, splat, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}] : ${message} `;
  //   if (metadata) {
  //     msg += JSON.stringify(metadata);
  //   }
  return msg;
});

/**
 * Sets up the application logger using environment settings.
 *
 * @param configuration The application configuration
 * @returns The application logger
 */
const setupLogger = (configuration) => {
  // Get the combined log file where logs are
  // going to be logged from the environment.
  //   const combinedLogFile = new winston.transports.File({
  //     filename: configuration.logFile,
  //   });

  // Get the error log file where errors are
  // going to be logged from the environment.
  //   const errorLogFile = new winston.transports.File({
  //     filename: configuration.errorLogFile,
  //     level: 'error',
  //   });

  // Get the base level at which the logger
  // will log an event from the environment.
  const baseLogLevel = configuration.logLevel;

  // Setupp the log line formatter.
  const logFormat = combine(format.colorize(), splat(), timestamp(), myFormat);

  // Create a logger to be used by the
  // application
  const logger = createLogger({
    level: baseLogLevel,
    format: logFormat,
    defaultMeta: {
      service: configuration.botName,
      environment: configuration.environment,
    },
    transports: [
      //errorLogFile,
      //combinedLogFile
    ],
  });

  // Attach a console logger if the application
  // is running outside of the production
  // environment
  if (configuration.environment !== 'production') {
    // Create the console trasnport
    const consoleTransport = new transports.Console({
      format: combine(format.colorize(), splat(), timestamp(), myFormat),
    });

    // Attach the console transport
    logger.add(consoleTransport);
  }

  return logger;
};

module.exports = setupLogger;
