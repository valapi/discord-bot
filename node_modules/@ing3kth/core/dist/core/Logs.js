"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logs = void 0;
//import
const fs = __importStar(require("fs"));
const util = __importStar(require("util"));
const process_1 = require("process");
const config_1 = require("../config");
const consoleColor = __importStar(require("../utils/ConsoleColor"));
/**
 * Log data for debugging purposes.
 */
class Logs {
    /**
     * @param {String} fileName File name.
     * @param {String} path Where to save the logs file.
     */
    constructor(fileName = 'NAME', path = config_1._config.logs.file.path) {
        this.classId = '@ing3kth/core/Logs';
        this.path = (0, process_1.cwd)() + '/ing3kth' + path + `/${fileName}.${config_1._config.logs.file.extension}`;
        if (!fs.existsSync(this.path)) {
            this.new();
        }
        else {
            this.file = fs.readFileSync(this.path);
        }
    }
    /**
     * @param {String} dataWithFile Insert Data with log file.
     * @returns {Promise<any>}
     */
    new(dataWithFile = Logs.logMessage('========== Logs File Created ==========', 'system')) {
        return __awaiter(this, void 0, void 0, function* () {
            if (config_1._config.logs.save) {
                const _FILE = yield fs.createWriteStream(this.path, {
                    flags: 'w'
                });
                yield _FILE.once('ready', () => __awaiter(this, void 0, void 0, function* () {
                    yield _FILE.write(String(dataWithFile));
                }));
                yield _FILE.on('finish', () => __awaiter(this, void 0, void 0, function* () {
                    try {
                        this.file = yield fs.readFileSync(this.path);
                    }
                    catch (err) {
                        console.log(`\n<error> ` + consoleColor.colored(`${this.classId} Fail To Create New Log At: ${this.path}`, 'red') + `\n`);
                        return err;
                    }
                }));
            }
        });
    }
    /**
     *
     * @param {any} data Any data to log.
     * @param {String} mode Log mode. (log, error, system)
     * @param {Boolean} showup Show the log in the console.
     * @returns {Promise<any>}
     */
    log(data, mode = 'info', showup = config_1._config.logs.show) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (String(mode).toLowerCase()) {
                case 'error':
                    if (showup) {
                        console.log(`\n<${mode}> ` + consoleColor.colored(`${String(data)}`, 'red') + `\n`);
                    }
                    data = new Error(data);
                    break;
                case 'warning':
                    if (showup) {
                        console.log(`<${mode}> ` + consoleColor.colored(`${String(data)}`, 'yellow'));
                    }
                    break;
                case 'system':
                    if (showup) {
                        console.log(`<${mode}> ` + consoleColor.colored(`${String(data)}`, 'cyan'));
                    }
                    break;
                case 'info':
                    if (showup) {
                        console.log(`<${mode}> ` + String(data));
                    }
                    break;
                default:
                    mode = 'unknown';
                    break;
            }
            if (config_1._config.logs.save) {
                try {
                    this.file += Logs.logMessage(data, mode);
                    yield fs.writeFileSync(this.path, yield this.file);
                }
                catch (err) {
                    console.log(`\n<error> ` + consoleColor.colored(`${this.classId} Wait A Second(s) To Create The Log File`, 'red') + `\n`);
                    return err;
                }
            }
            return yield data;
        });
    }
    /**
     *
     * @param {Boolean} showup Show the log in the console.
     * @returns {Promise<Array<ILogs>>}
     */
    get(showup = config_1._config.logs.show) {
        return __awaiter(this, void 0, void 0, function* () {
            var _get = [];
            if (fs.existsSync(this.path)) {
                const _getFile = String(this.file);
                const file_per_line = _getFile.split("\n");
                var file_split = [];
                for (const _line of file_per_line) {
                    file_split.push(_line.split("|||"));
                }
                for (let i = 0; i < file_split.length; i++) {
                    const _split = file_split[i];
                    const _log_date = new Date(_split[0]);
                    const _log_mode = String(_split[1]);
                    const _log_message = util.format(_split[2]);
                    if (_log_message === 'undefined') {
                        continue;
                    }
                    _get.push({
                        date: _log_date,
                        mode: _log_mode,
                        data: _log_message,
                    });
                }
                if (showup) {
                    console.log(_get);
                }
            }
            return _get;
        });
    }
    static logMessage(data, mode = 'info') {
        return `\n${new Date().toISOString()}|||${String(mode).toLowerCase()}|||${util.format(data)}`;
    }
    /**
     *
     * @param {any} data Any data to log.
     * @param {String} mode Log mode.
     * @param {Boolean} showup Show the log in the console.
     * @returns {Promise<void>}
     */
    static log(data, mode = 'info', showup = config_1._config.logs.show) {
        return __awaiter(this, void 0, void 0, function* () {
            const newLog = yield new Logs();
            yield newLog.log(data, mode, showup);
        });
    }
    /**
     *
     * @param {Boolean} showup Show the log in the console.
     * @returns {Promise<any>}
     */
    static get(showup = config_1._config.logs.show) {
        return __awaiter(this, void 0, void 0, function* () {
            const newLog = yield new Logs();
            return yield newLog.get(showup);
        });
    }
    /**
     * @param {Number} times Number of times to pre create the log.
     * @returns {Promise<void>}
     */
    static preCreate_WithDate(times = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const _date = new Date();
            let _year = Number(_date.getUTCFullYear());
            let _month = Number(_date.getUTCMonth());
            let _day = Number(_date.getUTCDate());
            let _hours = Number(_date.getUTCHours());
            for (let i = 0; i < Number(times); i++) {
                if (_hours > 24) {
                    break;
                }
                let fileName = `${_year}-${_month}-${_day}_${_hours}`;
                yield new Logs(fileName);
            }
        });
    }
}
exports.Logs = Logs;
//# sourceMappingURL=Logs.js.map