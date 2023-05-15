const httpContext = require("express-http-context");
const _ = require("lodash");
const { DateTime } = require("luxon");
const { createLogger, format, transports } = require("winston");

const config = require("../config");

class Logger {
  constructor() {
    const logger = createLogger({
      transports: [
        new transports.Console({
          format: format.printf((info) => {
            let message = DateTime.local().toString();

            // append app name
            message += ` | ${config.app.name} `;

            // append request id
            message += httpContext.get("requestId")
              ? `| ${httpContext.get("requestId")}`
              : "| -";

            // append message
            message += ` | ${info.level} | ${info.message}`;

            // append object
            if (info.obj !== undefined) {
              if (info.level !== "error") {
                message += ` | ${JSON.stringify(info.obj)}`;
              } else {
                if (_.get(info, "obj.stack")) {
                  message += ` | ${JSON.stringify(info.obj.stack)}`;
                } else {
                  message += ` | ${JSON.stringify(info.obj)}`;
                }
              }
            }

            return message;
          }),
        }),
      ],
    });

    this.logger = logger;
  }

  info(message, obj) {
    let o;
    if (config.app.env !== "test") {
      if (typeof obj === "string") {
        // remove multiple spaces and line breaks
        o = obj.replace(/ +(?= )/g, "").replace(/(\r\n|\n|\r)/gm, "");
      } else {
        o = obj;
      }

      this.logger.log("info", message, {
        obj: o,
      });
    }
  }

  error(message, obj) {
    let o;
    if (typeof obj === "string") {
      // remove multiple spaces and line breaks
      o = obj.replace(/ +(?= )/g, "").replace(/(\r\n|\n|\r)/gm, "");
    } else {
      o = obj;
    }

    this.logger.log("error", message, {
      obj: o,
    });
  }

  warn(message, obj) {
    this.logger.log("warn", message, {
      obj,
    });
  }
}

module.exports = new Logger();
