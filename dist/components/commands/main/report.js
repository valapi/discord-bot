"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const __command = {
    command: (new discord_js_1.SlashCommandBuilder()
        .setName('report')
        .setDescription('Report Bug To Developer')),
    category: 'miscellaneous',
    isPrivateMessage: true,
    inDevlopment: true,
    showDeferReply: false,
    echo: {
        data: [
            'reportbug',
        ],
    },
    execute({ interaction, language }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const CommandLanguage = language.data.command.report;
            const MyModal = new discord_js_1.ModalBuilder()
                .setCustomId('reportbug')
                .setTitle('Report Bug')
                .addComponents({
                type: discord_js_1.ComponentType.ActionRow,
                components: [
                    {
                        type: discord_js_1.ComponentType.TextInput,
                        custom_id: 'reportbug_topic',
                        label: `${CommandLanguage['topic_title']}`,
                        placeholder: `${CommandLanguage['topic_placeholder']}`,
                        required: true,
                        style: discord_js_1.TextInputStyle.Short,
                        min_length: 5,
                        max_length: 75,
                    },
                ],
            }, {
                type: discord_js_1.ComponentType.ActionRow,
                components: [
                    {
                        type: discord_js_1.ComponentType.TextInput,
                        custom_id: 'reportbug_message',
                        label: `${CommandLanguage['message_title']}`,
                        placeholder: `${CommandLanguage['message_placeholder']}`,
                        required: true,
                        style: discord_js_1.TextInputStyle.Paragraph,
                        min_length: 10,
                        max_length: 1000,
                    },
                ],
            });
            yield interaction.showModal(MyModal);
            return {
                content: language.data.error
            };
        });
    },
};
exports.default = __command;
