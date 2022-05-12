import { SlashCommandBuilder } from '@discordjs/builders';
import {
    type Client as DisClient, type CommandInteraction,
    MessageAttachment, MessageEmbed
} from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction:CommandInteraction): Promise<void> {
		await interaction.editReply('Pong!');
	},
};