"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const __menu = {
    customId: 'helplist',
    execute({ interaction, _SlashCommand, language }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const CommandLanguage = language.data.command.help;
            const _CommandType = interaction.values[0];
            const createEmbed = new discord_js_1.EmbedBuilder()
                .setTitle(`Help - ${_CommandType}`)
                .setColor('#0099ff');
            let sendMessage = ``;
            for (let cmd of _SlashCommand.List) {
                const _cmd = _SlashCommand.Collection.get(cmd.name);
                if (_cmd.inDevlopment === true) {
                    continue;
                }
                if (_cmd.category !== _CommandType) {
                    continue;
                }
                if (_cmd.echo && _cmd.echo.from) {
                    continue;
                }
                sendMessage += `${discord_js_1.Formatters.inlineCode('/' + _cmd.command.name)} - ${_cmd.command.description}\n`;
            }
            if (!sendMessage) {
                sendMessage += CommandLanguage['not_category'];
            }
            createEmbed.setDescription(sendMessage);
            return {
                embeds: [createEmbed],
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
        });
    },
};
exports.default = __menu;
