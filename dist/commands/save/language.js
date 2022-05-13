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
const discord_js_1 = require("discord.js");
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName('language')
        .setDescription('Change Language')
        .addStringOption(option => option
        .setName('language')
        .setDescription('Language')
        .setRequired(true)
        .addChoices({ name: 'English', value: 'en_US' }, { name: 'Thai', value: 'th_TH' })),
    permissions: [
        discord_js_1.Permissions.ALL,
    ],
    privateMessage: false,
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.editReply('Pong!');
            const _choice = interaction.options.getString('language');
            interaction.followUp({
                content: `Language changed to ${_choice}`,
            });
        });
    },
};
//# sourceMappingURL=language.js.map