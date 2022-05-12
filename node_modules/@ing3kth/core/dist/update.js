"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Update = void 0;
//import
const axios_1 = __importDefault(require("axios"));
const process_1 = require("process");
const fs_1 = require("fs");
//class
class Update {
    constructor() {
        this.classId = '@ing3kth/core/Update';
        this.axiosClient = axios_1.default.create();
    }
    /**
     *
     * @returns {Promise<any>}
     */
    getVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.axiosClient.get('https://ktng-3.github.io/api.json')).data;
        });
    }
    /**
     *
     * @returns {Promise<IUpdate>}
     */
    checkForUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            const _modules = (yield (0, process_1.cwd)()) + '/node_modules';
            const ing3kth_folder = _modules + '/@ing3kth';
            const ing3kth_api = yield this.getVersion();
            var _response = "Find new version available!";
            var _after_response = "";
            var _needUpdate = [];
            var _dontNeedUpdate = [];
            if ((0, fs_1.existsSync)(_modules) && (0, fs_1.existsSync)(ing3kth_folder)) {
                const packages = (0, fs_1.readdirSync)(ing3kth_folder);
                for (let _pack of packages) {
                    const package_json = require(ing3kth_folder + '/' + _pack + '/package.json');
                    const _pack_version = package_json.version; //Current version
                    const _api_version = ing3kth_api.npm[_pack].version; //Latest version
                    if (_pack_version !== _api_version) {
                        if (_pack_version > _api_version) {
                            _after_response += "\n- You have a newer version of " + _pack + " installed!";
                            continue;
                        }
                        _needUpdate.push({
                            name: _pack,
                            version: {
                                current: _pack_version,
                                latest: _api_version,
                            }
                        });
                    }
                    else {
                        _dontNeedUpdate.push({
                            name: _pack,
                            version: {
                                current: _pack_version,
                                latest: _api_version,
                            }
                        });
                    }
                }
            }
            else {
                _response = "You don't have any package installed!!";
                return {
                    response: _response,
                    data: {
                        update: _needUpdate,
                        latest: _dontNeedUpdate,
                    }
                };
            }
            if (_needUpdate.length <= 0) {
                _response = "No Update Available, all packages are up to date!!";
            }
            return {
                response: _response + _after_response,
                data: {
                    update: _needUpdate,
                    latest: _dontNeedUpdate,
                }
            };
        });
    }
    /**
     *
     * @returns {Promise<any>}
     */
    static getVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            const _newUpdate = new Update();
            return yield _newUpdate.getVersion();
        });
    }
    /**
     *
     * @returns {Promise<IUpdate>}
     */
    static checkForUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            const _newUpdate = new Update();
            return yield _newUpdate.checkForUpdate();
        });
    }
}
exports.Update = Update;
//# sourceMappingURL=update.js.map