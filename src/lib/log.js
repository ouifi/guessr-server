const console = require("console");
const chalk = require("chalk");

const LOG_LEVELS = {
    NONE: 0,
    ERROR: 1,
    WARN: 2,
    LOG: 3,
    DEBUG: 4,
    VERBOSE: 5,
};

const LOG_LEVELS_INVERSE = Object.keys(LOG_LEVELS);

let currentLevel = LOG_LEVELS.LOG;
const logConsole = new console.Console(process.stdout, process.stderr);

function prettier(elem) {
    if (typeof elem === "object") {
        return JSON.stringify(elem, undefined, 4); //Format the JSON in the module
    }
    return elem;
}

class Logger {
    static print(level = LOG_LEVELS.LOG, color = chalk.whiteBright, ...messages) {
        if (level <= currentLevel) {
            const printBase = `(${LOG_LEVELS_INVERSE[level]}) @${new Date().toISOString()}@`;
            logConsole.log(printBase, color(messages.map(prettier)));
        }
    }

    static error(...messages) {
        Logger.print(LOG_LEVELS.ERROR, chalk.redBright, ...messages);
    }

    static warn(...messages) {
        Logger.print(LOG_LEVELS.WARN, chalk.yellowBright, ...messages);
    }

    static log(...messages) {
        Logger.print(LOG_LEVELS.LOG, chalk.whiteBright, ...messages);
    }

    static debug(...messages) {
        Logger.print(LOG_LEVELS.DEBUG, chalk.greenBright, ...messages);
    }

    static verbose(...messages) {
        Logger.print(LOG_LEVELS.VERBOSE, chalk.blueBright, ...messages);
    }

    static setLogLevel(level) {
        currentLevel = level;
    }
}

module.exports = {
    Logger,
    LOG_LEVELS,
};
