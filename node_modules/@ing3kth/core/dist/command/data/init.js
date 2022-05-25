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
//import
const process = __importStar(require("process"));
const fs = __importStar(require("fs"));
//path
const _folder = process.cwd() + "/ing3kth";
const _cache_path = "/cache";
const _cache = _folder + _cache_path;
const _logs_path = "/logs";
const _logs = _folder + _logs_path;
const _config_path = "/config.json";
const _config = _folder + _config_path;
var _localappdata = String(process.env.LOCALAPPDATA);
var _appdata = String(process.env.APPDATA);
if (!_localappdata) {
    _localappdata == "";
}
if (!_appdata) {
    _appdata == "";
}
//export
exports.default = {
    data: {
        name: "init",
        description: "Create Config File",
        option: [
            {
                name: "-f, --force",
                description: "Force to create config file",
            },
        ],
    },
    //script
    execute({ force }) {
        return __awaiter(this, void 0, void 0, function* () {
            //folder
            if (!fs.existsSync(_folder)) {
                force = true;
                fs.mkdirSync(_folder);
            }
            //cache
            if (!fs.existsSync(_cache)) {
                fs.mkdirSync(_cache);
                fs.createWriteStream(_cache + "/NAME.json", {
                    flags: 'w'
                }).write(JSON.stringify({}));
            }
            //Logs
            if (!fs.existsSync(_logs)) {
                fs.mkdirSync(_logs);
                fs.createWriteStream(_logs + "/NAME.log", {
                    flags: 'w'
                }).write(`date|||mode|||data`);
            }
            //config
            if (!fs.existsSync(_config)) {
                yield exports.default.config();
            }
            else {
                if (!force) {
                    console.log(`\nFind config file at: ${_config}\n`);
                    return _config;
                }
                yield exports.default.config();
            }
            return _config;
        });
    },
    config() {
        return __awaiter(this, void 0, void 0, function* () {
            //script
            const _file = yield fs.createWriteStream(_config, {
                flags: "w",
            });
            //create config file
            yield _file.write(JSON.stringify({
                create: String(new Date().toISOString()),
                version: 2,
                logs: {
                    save: false,
                    show: true,
                    file: {
                        path: _logs_path,
                        extension: "log",
                    }
                },
                cache: {
                    file: {
                        path: _cache_path,
                        extension: "json",
                    }
                },
                "val-api": {
                    RiotLocal: {
                        ip: '127.0.0.1',
                        username: 'riot',
                        lockfile: _localappdata + "/Riot Games/Riot Client/Config/lockfile",
                    },
                    ValClient: {
                        auth: {
                            'User-Agent': 'RiotClient/43.0.1.4195386.4190634 rso-auth (Windows; 10;;Professional, x64)',
                        },
                        client: {
                            version: 'release-04.07-shipping-15-699063',
                            platfrom: {
                                platformType: 'PC',
                                platformOS: 'Windows',
                                platformOSVersion: '10.0.19042.1.256.64bit',
                                platformChipset: 'Unknown'
                            },
                        }
                    }
                },
            }));
            yield console.log(`\nCreate config file at: ${_config}\n`);
        });
    }
};
//# sourceMappingURL=init.js.map