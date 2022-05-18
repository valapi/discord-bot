"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_modals_1 = require("discord-modals");
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName('modal')
        .setDescription('Generate a modal'),
    showDeferReply: false,
    execute({ interaction, DiscordClient }) {
        return __awaiter(this, void 0, void 0, function* () {
            //create model
            const TextInput1 = new discord_modals_1.TextInputComponent() // We create a Text Input Component
                .setCustomId('CardInfo-1')
                .setLabel('Some text Here')
                .setStyle('LONG') //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
                .setMinLength(4)
                .setMaxLength(10)
                .setPlaceholder('Write a text here')
                .setRequired(true); // If it's required or not
            const modal = new discord_modals_1.Modal() // We create a Modal
                .setCustomId('GiveMeYourCreditCard')
                .setTitle('Test of Discord-Modals!')
                .addComponents(TextInput1);
            yield (0, discord_modals_1.showModal)(modal, {
                client: DiscordClient,
                interaction: interaction,
            });
        });
    },
};
//# sourceMappingURL=modal.js.map