//import

import * as IngCore from '@ing3kth/core';
import { Permissions, SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, Formatters, ComponentType, ButtonBuilder, ButtonStyle, SelectMenuBuilder, ModalBuilder } from 'discord.js';
import type { ICommandHandler } from "../../../modules";

//script

const __command: ICommandHandler.File = {
    command: (
        new SlashCommandBuilder()
            .setName('help')
            .setDescription('Show all Commands')
    ),
    category: 'miscellaneous',
    async execute({ }) {
        //return

        return {
            embeds: [
                new EmbedBuilder()
                    .setTitle('Help')
                    .setDescription('You can select one of the categories below')
                    .addFields(
                        {
                            name: '/reportbug',
                            value: 'Report Bug To Developer',
                            inline: true,
                        },
                        {
                            name: '/account',
                            value: 'Manage Valorant Account',
                            inline: true,
                        },
                        {
                            name: '/language',
                            value: 'Change Language',
                            inline: true,
                        },
                    )
                    .setColor('#0099ff'),
            ],
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
                    ],
                }
            ],
        };
    },
}

//export

export default __command;