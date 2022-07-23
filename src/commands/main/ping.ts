//import

import * as IngCore from '@ing3kth/core';
import { Permissions, SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, Formatters, ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder, ModalBuilder } from 'discord.js';
import type { ICommandHandler } from "../../modules";

//script

const __command: ICommandHandler.File = {
    command: (
        new SlashCommandBuilder()
            .setName('ping')
            .setDescription('Replies with Pong!')
    ),
    category: 'miscellaneous',
    async execute({ }) {
        return {
            content: 'Pong !!',
        };
    },
}

//export

export default __command;