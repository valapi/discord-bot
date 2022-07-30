"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const __modal = {
    customId: 'reportbug',
    execute({ interaction, DiscordBot, language }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const CommandLanguage = language.data.command.report;
            const _Content = `Topic:\n**${interaction.fields.getTextInputValue('reportbug_topic')}**\n\nMessage:\n${discord_js_1.Formatters.blockQuote(interaction.fields.getTextInputValue('reportbug_message'))}`;
            const ClientOwnerChat = yield DiscordBot.users.fetch('549231132382855189');
            yield ClientOwnerChat.send({
                content: `${discord_js_1.Formatters.userMention(interaction.user.id)} has reported a bug!\n\n${_Content}`,
            });
            return {
                content: `${CommandLanguage['thanks']}\n\n${_Content}`,
                ephemeral: true,
            };
        });
    },
};
exports.default = __modal;
