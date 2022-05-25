#! /usr/bin/env node
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
Object.defineProperty(exports, "__esModule", { value: true });
//import
const fs_1 = require("fs");
const commander = __importStar(require("commander"));
//script
const commandsFolders = (0, fs_1.readdirSync)(__dirname + '/data').filter((file) => file.endsWith('.js'));
for (const file of commandsFolders) {
    const command = require(`./data/${file}`).default;
    const newCommand = commander.program
        .command(command.data.name)
        .description(command.data.description)
        .action(command.execute);
    if (command.data.option && command.data.option.length > 0) {
        for (const option of command.data.option) {
            newCommand.option(option.name, option.description);
        }
    }
}
//export
commander.program.parse();
//# sourceMappingURL=main.js.map