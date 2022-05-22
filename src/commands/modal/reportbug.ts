import { Permissions, MessageAttachment, MessageEmbed, Formatters, MessageActionRow, MessageButton } from 'discord.js';
import type { ModalSubmitInteraction } from "discord-modals";

import * as IngCore from '@ing3kth/core';
import type { EventExtraData } from "../../interface/EventData";
import { getLanguageAndUndefined } from "../../language/controller";

export default {
    customId: 'reportbug',
    async execute(modal: ModalSubmitInteraction, { client }: EventExtraData) {
        const _language = getLanguageAndUndefined(await IngCore.Cache.output({ name: 'language', interactionId: String(modal.guildId) }));

        // main reply //

        const createButtons = new MessageActionRow()
            .addComponents( //max 5
                new MessageButton()
                    .setCustomId('reportagain')
                    .setLabel('Show Report Form') //title
                    .setStyle('SECONDARY'),
            );

        await modal.reply({
            content: `${_language.data.command['report']['thanks']}`,
            components: [ createButtons ],
            ephemeral: true
        });

        // on submit //

        const _Topic = modal.getTextInputValue('reportbug-text1');
        const _Message = modal.getTextInputValue('reportbug-text2');

        const OwnerOfClient = await client.users.fetch('549231132382855189');
        await OwnerOfClient.send({
            content: `${Formatters.userMention(modal.user.id)} has reported a bug!\n\nTopic:\n**${_Topic}**\n\nMessage:\n${Formatters.blockQuote(_Message)}`,
        });
    }
}