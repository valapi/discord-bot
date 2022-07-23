//import

import * as IngCore from '@ing3kth/core';
import { Permissions, SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, Formatters, ComponentType, ButtonBuilder, ButtonStyle, SelectMenuBuilder, ModalBuilder } from 'discord.js';
import type { IMenuHandler, ICommandHandler } from "../../modules";

//script

const __menu: IMenuHandler.File = {
    customId: 'helplist',
    async execute({ interaction, _SlashCommand }) {
        //load

        const _CommandType: string = interaction.values[0] as ICommandHandler.Category;

        const createEmbed = new EmbedBuilder()
            .setTitle(`Help - ${_CommandType}`)
            .setColor('#0099ff')

        //script

        let sendMessage: string = ``;

        for (let cmd of _SlashCommand.List) {
            const _cmd = _SlashCommand.Collection.get(cmd.name) as ICommandHandler.File;

            if (_cmd.inDevlopment === true) {
                continue;
            }

            if (_cmd.category != (_CommandType.toLocaleLowerCase())) {
                continue;
            }

            if(!_cmd.echo || !_cmd.echo?.from) {
                continue;
            }

            sendMessage += `${Formatters.inlineCode('/' + _cmd.command.name)} - ${_cmd.command.description}\n`;
        }

        if (!sendMessage) {
            sendMessage = `No command in this category.`;
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
                            .setPlaceholder('Select Command Type')
                            .setMinValues(1)
                            .setMaxValues(1)
                            .addOptions(
                                {
                                    label: 'Settings',
                                    description: 'Change Settings',
                                    value: 'settings',
                                },
                                {
                                    label: 'Infomation',
                                    description: 'Show Infomations',
                                    value: 'infomation',
                                },
                                {
                                    label: 'Valorant',
                                    description: 'Valorant InGame Info',
                                    value: 'valorant',
                                },
                                {
                                    label: 'Miscellaneous',
                                    description: 'Other Commands',
                                    value: 'miscellaneous',
                                },
                            ),
                    ]
                }
            ],
        };
    },
}

//export

export default __menu;