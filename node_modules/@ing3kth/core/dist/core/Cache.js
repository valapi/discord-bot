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
exports.Cache = void 0;
//import
const fs = __importStar(require("fs"));
const process_1 = require("process");
const config_1 = require("../config");
const consoleColor = __importStar(require("../utils/ConsoleColor"));
//class
/**
 * Cache Data in JSON format.
 */
class Cache {
    /**
     *
     * @param {String} name Name
     */
    constructor(name = 'NAME') {
        this.classId = '@ing3kth/core/Cache';
        this.baseName = name;
        this.path = (0, process_1.cwd)() + '/ing3kth' + config_1._config.cache.file.path + `/${this.baseName}.${config_1._config.cache.file.extension}`;
        if (!fs.existsSync(this.path)) {
            this.create();
        }
        else {
            this.file = fs.readFileSync(this.path);
        }
    }
    /**
     * @param {Object} dataWithFile Insert Data with log file.
     * @returns {Promise<any>}
     */
    create(dataWithFile = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const _FILE = yield fs.createWriteStream(this.path, {
                flags: 'w'
            });
            yield _FILE.once('ready', () => __awaiter(this, void 0, void 0, function* () {
                yield _FILE.write(JSON.stringify(dataWithFile));
            }));
            yield _FILE.on('finish', () => __awaiter(this, void 0, void 0, function* () {
                try {
                    this.file = yield fs.readFileSync(this.path);
                }
                catch (err) {
                    console.log(`\n<error> ` + consoleColor.colored(`${this.classId} Fail To Create ${this.baseName} Cache At: ${this.path}`, 'red') + `\n`);
                    return err;
                }
            }));
        });
    }
    /**
     *
     * @param {any} data Data to save.
     * @param {String} interactionId Interaction ID.
     * @returns {Promise<ICache>}
     */
    input(data, interactionId = '') {
        return __awaiter(this, void 0, void 0, function* () {
            if (!interactionId) {
                interactionId = String(new Date().getTime());
            }
            try {
                let _json = yield JSON.parse(this.file);
                _json[interactionId] = data;
                yield fs.writeFileSync(this.path, yield JSON.stringify(yield _json));
            }
            catch (err) {
                console.log(`\n<error> ` + consoleColor.colored(`${this.classId} Wait A Second(s) To Create The Cache File`, 'red') + `\n`);
                yield fs.writeFileSync(this.path, yield JSON.stringify({}));
            }
            return {
                name: this.baseName,
                interactionId: interactionId,
            };
        });
    }
    /**
     * @param {String} interactionId Interaction ID.
     * @returns {Promise<any>}
     */
    output(interactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const _json = yield JSON.parse(this.file);
            return yield _json[interactionId];
        });
    }
    /**
     * @param {String} interactionId Interaction ID.
     * @returns {Promise<void>}
     */
    clear(interactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            let _json = yield JSON.parse(this.file);
            delete _json[interactionId];
            yield fs.writeFileSync(this.path, yield JSON.stringify(yield _json));
        });
    }
    /**
     * @param {ICache} path Path to Data.
     * @returns {Promise<any>}
     */
    static output(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const _NewCache = yield new Cache(path.name);
            return yield _NewCache.output(path.interactionId);
        });
    }
}
exports.Cache = Cache;
//# sourceMappingURL=Cache.js.map