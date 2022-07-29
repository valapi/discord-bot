"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const __command = {
    command: (new discord_js_1.SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!')),
    category: 'miscellaneous',
    async execute({ language }) {
        return {
            content: language.data.command['ping'].default,
        };
    },
};
exports.default = __command;
