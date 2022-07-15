"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genarateReportForm = void 0;
const discord_modals_1 = require("discord-modals");
function genarateReportForm(language) {
    const TextInput1 = new discord_modals_1.TextInputComponent()
        .setCustomId('reportbug-text1')
        .setLabel(`${language.data.command['report']['topic_title']}`)
        .setStyle('SHORT')
        .setMinLength(5)
        .setMaxLength(35)
        .setPlaceholder(`${language.data.command['report']['topic_placeholder']}`)
        .setRequired(true);
    const TextInput2 = new discord_modals_1.TextInputComponent()
        .setCustomId('reportbug-text2')
        .setLabel(`${language.data.command['report']['message_title']}`)
        .setStyle('LONG')
        .setMinLength(10)
        .setMaxLength(500)
        .setPlaceholder(`${language.data.command['report']['message_placeholder']}`)
        .setRequired(true);
    const modal = new discord_modals_1.Modal()
        .setCustomId('reportbug')
        .setTitle('Report Bug')
        .addComponents(TextInput1, TextInput2);
    return modal;
}
exports.genarateReportForm = genarateReportForm;
