import { SlashCommandBuilder } from '@discordjs/builders';
import { Permissions, MessageAttachment, MessageEmbed, Formatters, MessageActionRow, MessageButton, MessageSelectMenu } from 'discord.js';
import type { CustomSlashCommands } from '../../../interface/SlashCommand';

export default {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	type: 'miscellaneous',
	async execute({ interaction, language }) {
		//script
        const CommandLanguage = language.data.command['ping'];

		await interaction.editReply(CommandLanguage.default);
	},
} as CustomSlashCommands;