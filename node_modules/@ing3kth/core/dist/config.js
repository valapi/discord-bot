"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._config = void 0;
const process_1 = require("process");
const fs_1 = require("fs");
const ConsoleColor_1 = require("./utils/ConsoleColor");
const _path = (0, process_1.cwd)() + '/ing3kth/config.json';
if (!(0, fs_1.existsSync)(_path)) {
    throw new Error(`\nConfig file not found!, Please run ${(0, ConsoleColor_1.colored)("'npx ing3kth init'", 'yellow')} to create config file.\n`);
}
const _config = require(String(_path));
exports._config = _config;
//# sourceMappingURL=config.js.map