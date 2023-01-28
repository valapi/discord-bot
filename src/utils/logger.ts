import * as path from "node:path";
import * as winston from "winston";

export default winston.createLogger({
    level: "debug",
    format: winston.format.combine(
        winston.format.label({
            label: path.basename(require.main?.filename || "undefined")
        }),
        winston.format.timestamp({
            format: "HH:mm:ss"
        }),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf((info) => {
                    return `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`;
                })
            )
        }),
        new winston.transports.File({
            format: winston.format.combine(
                winston.format.uncolorize(),
                winston.format.printf((info) => {
                    return `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`;
                })
            ),
            filename: `.log`
        })
    ]
});
