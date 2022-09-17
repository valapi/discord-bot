//import

import { Formatters } from 'discord.js';
import type { IModalHandler } from "../../modules";

//script

const __modal: IModalHandler.File = {
    customId: 'reportbug',
    async execute({ interaction, DiscordBot, language }) {
        //load

        const CommandLanguage = language.data.command.report;

        //script

        const _Content = `Topic:\n**${interaction.fields.getTextInputValue('reportbug_topic')}**\n\nMessage:\n${Formatters.blockQuote(interaction.fields.getTextInputValue('reportbug_message'))}`;

        const ClientOwnerChat = await DiscordBot.users.fetch('549231132382855189');
        await ClientOwnerChat.send({
            content: `${Formatters.userMention(interaction.user.id)} has reported a bug!\n\n${_Content}`,
        });

        // return //

        return {
            content: `${CommandLanguage['thanks']}\n\n${_Content}`,
            ephemeral: true,
        };
    },
};

//export

export default __modal;