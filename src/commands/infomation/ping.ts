import { SlashCommandBuilder } from '@discordjs/builders';
import {
    type Client as DisClient, type CommandInteraction, Permissions,
    MessageAttachment, MessageEmbed,
} from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
    permissions: [
        Permissions.ALL,
    ],
	privateMessage: false,
	async execute(interaction:CommandInteraction): Promise<void> {
		await interaction.editReply('Pong!');
	},
};