import { Formatters } from "discord.js";
import type { ModalSubmitInteraction } from "discord-modals";

import type { EventExtraData } from "../interface/EventData";

export default {
	name: 'modalSubmit',
	once: true,
	async execute(modal:ModalSubmitInteraction, _extraData:EventExtraData) {
		if(modal.customId === 'GiveMeYourCreditCard'){
            const firstResponse = modal.getTextInputValue('CardInfo-1');
            await modal.reply({ content: 'Congrats! Powered by discord-modals.' + Formatters.codeBlock('markdown', firstResponse), ephemeral: true });
        }
	},
};