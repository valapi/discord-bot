import { SlashCommandBuilder } from '@discordjs/builders';
import {
    type Client as DisClient, type CommandInteraction, Permissions,
    MessageAttachment, MessageEmbed,
} from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('language')
		.setDescription('Change Language')
        .addStringOption(option =>
            option
                .setName('language')
                .setDescription('Language')
                .setRequired(true)
                .addChoices(
                    { name: 'English', value: 'en_US' },
                    { name: 'Thai', value: 'th_TH' },
                )
        ),
    permissions: [
        Permissions.ALL,
    ],
	privateMessage: false,
	async execute(interaction:CommandInteraction): Promise<void> {
		await interaction.editReply('Pong!');

        const _choice = interaction.options.getString('language');

        interaction.followUp({
            content: `Language changed to ${_choice}`,
        });
	},
};