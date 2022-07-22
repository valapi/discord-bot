//import

import type { ICommandHandler } from "../../modules";
import { SlashCommandBuilder } from "discord.js";

import * as IngCore from '@ing3kth/core';

//script

const __command: ICommandHandler.File = {
    command: (
        new SlashCommandBuilder()
            .setName('ping')
            .setDescription('Replies with Pong!')
    ),
    category: 'miscellaneous',
    async execute({ interaction }) {
        return {
            content: 'Pong !!',
        };
    },
}

//export

export default __command;