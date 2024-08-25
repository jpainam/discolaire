import { env } from "process";
import "server-only";
import winston from "winston";

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = winston.createLogger({
  level: env.NODE_ENV === "development" ? "debug" : "info",
  format: winston.format.combine(
    enumerateErrorFormat(),
    env.NODE_ENV === "development"
      ? winston.format.colorize()
      : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [
    new winston.transports.File({
      filename: "error.log",
      level: "error",
      format: winston.format.uncolorize(),
    }),
    //new winston.transports.File({ filename: "combined.log" }),
    new winston.transports.Console({
      stderrLevels: ["error"],
    }),
  ],
});

export default logger;
