"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const __command = {
    command: (new discord_js_1.SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!')),
    category: 'miscellaneous',
    execute({ language }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return {
                content: language.data.command['ping'].default,
            };
        });
    },
};
exports.default = __command;
