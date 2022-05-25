import { SlashCommandBuilder } from '@discordjs/builders';
import { Permissions, MessageAttachment, MessageEmbed, Formatters, MessageActionRow, MessageButton, MessageSelectMenu } from 'discord.js';
import type { CustomSlashCommands } from '../../../interface/SlashCommand';

export default {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Show all Commands'),
    type: 'infomation',
	async execute({ interaction }) {
		//script
        const createEmbed = new MessageEmbed()
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
            .setColor('#0099ff')

        // help list

        const createComponents = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
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
            );

        await interaction.editReply({
            embeds: [ createEmbed ],
            components: [ createComponents ],
        });
	},
} as CustomSlashCommands;