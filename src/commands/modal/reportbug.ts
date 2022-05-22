import { Formatters } from "discord.js";
import type { ModalSubmitInteraction } from "discord-modals";

import * as IngCore from '@ing3kth/core';
import type { EventExtraData } from "../../interface/EventData";
import { getLanguageAndUndefined } from "../../language/controller";

export default {
    customId: 'reportbug',
    async execute(modal: ModalSubmitInteraction, { client }: EventExtraData) {
        const _language = getLanguageAndUndefined(await IngCore.Cache.output({ name: 'language', interactionId: String(modal.guildId) }));

        // main reply //

        await modal.reply({
            content: `${_language.data.command['report']['thanks']}`,
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