"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const __command = {
    command: (new discord_js_1.SlashCommandBuilder()
        .setName('help')
        .setDescription('Show all Commands')),
    category: 'infomation',
    async execute({ language }) {
        const CommandLanguage = language.data.command.help;
        return {
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setTitle('Help')
                    .setDescription(CommandLanguage['select_category'])
                    .addFields({
                    name: '/reportbug',
                    value: 'Report Bug To Developer',
                    inline: true,
                }, {
                    name: '/account',
                    value: 'Manage Valorant Account',
                    inline: true,
                }, {
                    name: '/language',
                    value: 'Change Language',
                    inline: true,
                })
                    .setColor('#0099ff'),
            ],
            components: [
                {
                    type: discord_js_1.ComponentType.ActionRow,
                    components: [
                        new discord_js_1.SelectMenuBuilder()
                            .setCustomId('helplist')
                            .setPlaceholder(CommandLanguage['placeholder'])
                            .setMinValues(1)
                            .setMaxValues(1)
                            .addOptions({
                            label: 'Settings',
                            description: CommandLanguage['type_settings'],
                            value: 'settings',
                        }, {
                            label: 'Infomation',
                            description: CommandLanguage['type_infomation'],
                            value: 'infomation',
                        }, {
                            label: 'Valorant',
                            description: CommandLanguage['type_valorant'],
                            value: 'valorant',
                        }, {
                            label: 'Miscellaneous',
                            description: CommandLanguage['type_miscellaneous'],
                            value: 'miscellaneous',
                        }),
                    ],
                },
            ],
        };
    },
};
exports.default = __command;
