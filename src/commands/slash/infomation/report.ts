import { SlashCommandBuilder } from '@discordjs/builders';
import { Permissions, MessageAttachment, MessageEmbed, Formatters } from 'discord.js';
import type { CustomSlashCommands } from '../../../interface/SlashCommand';

import { Modal, TextInputComponent, showModal } from "discord-modals";

export default {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('Report Bug To Developer'),
    type: 'miscellaneous',
    showDeferReply: false,
    echo: {
        command: [
            'reportbug',
        ]
    },
    async execute({ interaction, DiscordClient, language }) {
        //create model
        const TextInput1 = new TextInputComponent()
            .setCustomId('reportbug-text1')
            .setLabel(`${language.data.command['report']['topic_title']}`)
            .setStyle('SHORT')
            .setMinLength(5)
            .setMaxLength(20)
            .setPlaceholder(`${language.data.command['report']['topic_placeholder']}`)
            .setRequired(true);

        const TextInput2 = new TextInputComponent()
            .setCustomId('reportbug-text2')
            .setLabel(`${language.data.command['report']['message_title']}`)
            .setStyle('LONG')
            .setMinLength(10)
            .setMaxLength(500)
            .setPlaceholder(`${language.data.command['report']['message_placeholder']}`)
            .setRequired(true);

        const modal = new Modal()
            .setCustomId('reportbug')
            .setTitle('Report Bug')
            .addComponents(TextInput1, TextInput2);

        await showModal(modal, {
            client: DiscordClient,
            interaction: interaction,
        })
    },
} as CustomSlashCommands;