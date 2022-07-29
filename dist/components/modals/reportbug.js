"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const __modal = {
    customId: 'reportbug',
    async execute({ interaction, DiscordBot, language }) {
        const CommandLanguage = language.data.command.report;
        const _Content = `Topic:\n**${interaction.fields.getTextInputValue('reportbug_topic')}**\n\nMessage:\n${discord_js_1.Formatters.blockQuote(interaction.fields.getTextInputValue('reportbug_message'))}`;
        const ClientOwnerChat = await DiscordBot.users.fetch('549231132382855189');
        await ClientOwnerChat.send({
            content: `${discord_js_1.Formatters.userMention(interaction.user.id)} has reported a bug!\n\n${_Content}`,
        });
        return {
            content: `${CommandLanguage['thanks']}\n\n${_Content}`,
            ephemeral: true,
        };
    },
};
exports.default = __modal;
