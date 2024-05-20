import { createLogger, format, transports } from "winston";
import Transport from "winston-transport";
import TransportStream from "winston-transport";
import { LoggingWinston } from "@google-cloud/logging-winston";

function configureTransports(): Array<TransportStream> {
  // Base transport always show to console
  const transportConfig: Array<Transport> = [
    new transports.Console({
      level: 'debug',
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.align(),
        format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
      ),
    }),
  ];

  // Local transport save to file.
  // Should not be available if run without persistent storage i.e. in stateless container.
  if (process.env.DEPLOYMENT === "LOCAL_DEV") {
    transportConfig.push(
      new transports.File({
        level: "warn",
        filename: "warn.log",
        format: format.combine(format.timestamp(), format.json()),
        maxsize: 10000,
      }),
      new transports.File({
        level: "info",
        filename: "info.log",
        format: format.combine(format.timestamp(), format.json()),
        maxsize: 10000,
      }),
    );
  }

  // Google Cloud Logging
  if (process.env.DEPLOYMENT === "GOOGLE_CLOUD") {
    transportConfig.push(new LoggingWinston());
  }

  return transportConfig;
}

export const logger = createLogger({
  transports: configureTransports(),
});
