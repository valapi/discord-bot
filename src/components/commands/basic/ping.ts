//import

import * as IngCore from '@ing3kth/core';
import { SlashCommandBuilder } from 'discord.js';
import type { ICommandHandler } from "../../../modules";

//script

const __command: ICommandHandler.File = {
    command: (
        new SlashCommandBuilder()
            .setName('ping')
            .setDescription('Replies with Pong!')
    ),
    category: 'miscellaneous',
    async execute({ language }) {
        //return

        return {
            content: language.data.command['ping'].default,
        };
    },
}

//export

export default __command;