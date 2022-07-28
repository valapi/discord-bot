//import

import * as IngCore from '@ing3kth/core';
import { EmbedBuilder, Formatters, ComponentType, SelectMenuBuilder } from 'discord.js';
import type { IMenuHandler, ICommandHandler } from "../../modules";

//script

const __menu: IMenuHandler.File = {
    customId: 'helplist',
    async execute({ interaction, _SlashCommand, language }) {
        //load

        const CommandLanguage = language.data.command.help;

        const _CommandType = interaction.values[0] as ICommandHandler.Category;

        const createEmbed = new EmbedBuilder()
            .setTitle(`Help - ${_CommandType}`)
            .setColor('#0099ff');

        //script

        let sendMessage = ``;

        for (const cmd of _SlashCommand.List) {
            const _cmd = _SlashCommand.Collection.get(cmd.name) as ICommandHandler.File;

            if (_cmd.inDevlopment === true) {
                continue;
            }

            if (_cmd.category !== _CommandType) {
                continue;
            }

            if (_cmd.echo && _cmd.echo.from) {
                continue;
            }

            sendMessage += `${Formatters.inlineCode(`/${_cmd.command.name}`)} - ${_cmd.command.description}\n`;
        }

        if (!sendMessage) {
            sendMessage += CommandLanguage['not_category'];
        }

        createEmbed.setDescription(sendMessage);

        //return

        return {
            embeds: [createEmbed],
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        new SelectMenuBuilder()
                            .setCustomId('helplist')
                            .setPlaceholder(CommandLanguage['placeholder'])
                            .setMinValues(1)
                            .setMaxValues(1)
                            .addOptions(
                                {
                                    label: 'Settings',
                                    description: CommandLanguage['type_settings'],
                                    value: 'settings',
                                },
                                {
                                    label: 'Infomation',
                                    description: CommandLanguage['type_infomation'],
                                    value: 'infomation',
                                },
                                {
                                    label: 'Valorant',
                                    description: CommandLanguage['type_valorant'],
                                    value: 'valorant',
                                },
                                {
                                    label: 'Miscellaneous',
                                    description: CommandLanguage['type_miscellaneous'],
                                    value: 'miscellaneous',
                                },
                            ),
                    ],
                },
            ],
        };
    },
};

//export

export default __menu;