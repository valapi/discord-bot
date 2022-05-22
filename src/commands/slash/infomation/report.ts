import { SlashCommandBuilder } from '@discordjs/builders';
import { Permissions, MessageAttachment, MessageEmbed, Formatters, MessageActionRow, MessageButton } from 'discord.js';
import type { CustomSlashCommands } from '../../../interface/SlashCommand';

import { showModal } from "discord-modals";
import { genarateReportForm } from '../../../interface/ReportModal';

export default {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('Report Bug To Developer'),
    type: 'miscellaneous',
    showDeferReply: false,
    privateMessage: true,
    echo: {
        command: [
            'reportbug',
        ]
    },
    async execute({ interaction, DiscordClient, language }) {
        //create model
        
        const modal = genarateReportForm(language);

        await showModal(modal, {
            client: DiscordClient,
            interaction: interaction,
        })
    },
} as CustomSlashCommands;