import { Permissions, MessageAttachment, MessageEmbed, Formatters, MessageActionRow, MessageButton, MessageSelectMenu } from 'discord.js';
import type { CustomButton } from '../../interface/Button';

import { genarateReportForm } from '../../interface/ReportModal';
import { showModal } from 'discord-modals';

export default {
    customId: 'reportagain',
    showDeferReply: false,
    privateMessage: true,
    async execute({ interaction, language, DiscordClient }) {
        //script
        const modal = genarateReportForm(language);
        await showModal(modal, {
            client: DiscordClient,
            interaction: interaction,
        });
    }
} as CustomButton