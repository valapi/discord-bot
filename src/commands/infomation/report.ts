import { SlashCommandBuilder } from '@discordjs/builders';
import { Permissions, MessageAttachment, MessageEmbed, Formatters } from 'discord.js';
import type { CustomSlashCommands } from '../../interface/SlashCommand';

import { Modal, TextInputComponent, showModal } from "discord-modals";

export default {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('Report Bug To Developer'),
    showDeferReply: false,
    echo: {
        command: [
            'reportbug',
        ]
    },
    async execute({ interaction, DiscordClient }) {
        //create model
        const TextInput1 = new TextInputComponent()
            .setCustomId('reportbug-text1')
            .setLabel('Topic')
            .setStyle('SHORT')
            .setMinLength(5)
            .setMaxLength(20)
            .setPlaceholder(`Put your message here`)
            .setRequired(false);

        const TextInput2 = new TextInputComponent()
            .setCustomId('reportbug-text2')
            .setLabel('Report Message')
            .setStyle('LONG')
            .setMinLength(10)
            .setMaxLength(500)
            .setPlaceholder(`Put your message here`)
            .setRequired(true);

        const modal = new Modal()
            .setCustomId('reportbug-modal')
            .setTitle('Report Bug')
            .addComponents(TextInput1, TextInput2);

        await showModal(modal, {
            client: DiscordClient,
            interaction: interaction,
        })
    },
} as CustomSlashCommands;