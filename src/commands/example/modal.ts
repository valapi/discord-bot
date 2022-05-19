import { SlashCommandBuilder } from '@discordjs/builders';
import { Permissions, MessageAttachment, MessageEmbed, Formatters } from 'discord.js';
import type { CustomSlashCommands } from '../../interface/SlashCommand';

import { Modal, TextInputComponent, showModal } from "discord-modals";

export default {
    data: new SlashCommandBuilder()
        .setName('modal')
        .setDescription('Generate a modal'),
    showDeferReply: false,
    async execute({ interaction, DiscordClient }) {
        //create model
        const TextInput1 = new TextInputComponent() // We create a Text Input Component
            .setCustomId('CardInfo-1')
            .setLabel('LABEL - Some text Here')
            .setStyle('SHORT') //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
            .setMinLength(4) //message length min
            .setMaxLength(10) //message length max
            .setPlaceholder('Write a text here')
            .setDefaultValue('Default Value') //default value for [required === false]
            .setRequired(true); // If it's required or not

        const modal = new Modal() // We create a Modal
            .setCustomId('GiveMeYourCreditCard')
            .setTitle('Title - Here')
            .addComponents(TextInput1);

        await showModal(modal, {
            client: DiscordClient,
            interaction: interaction,
        })
    },
} as CustomSlashCommands;