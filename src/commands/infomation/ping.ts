import { SlashCommandBuilder } from '@discordjs/builders';
import { Permissions, MessageAttachment, MessageEmbed } from 'discord.js';
import type { CustomSlashCommands } from '../../interface/SlashCommand';

export default {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
    permissions: [
        Permissions.ALL,
    ],
	privateMessage: false,
	async execute({ interaction, language }) {
		//script
        const CommandLanguage = language.data.command['ping'];

		await interaction.editReply(CommandLanguage.default);
	},
} as CustomSlashCommands;