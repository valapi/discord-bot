"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const builders_1 = require("@discordjs/builders");
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    type: 'miscellaneous',
    execute({ interaction, language }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const CommandLanguage = language.data.command['ping'];
            yield interaction.editReply(CommandLanguage.default);
        });
    },
};
