import { Modal, TextInputComponent } from "discord-modals";
import { ILanguage } from "../language/interface";

function genarateReportForm(language: ILanguage): Modal {
    const TextInput1 = new TextInputComponent()
        .setCustomId('reportbug-text1')
        .setLabel(`${language.data.command['report']['topic_title']}`)
        .setStyle('SHORT')
        .setMinLength(5)
        .setMaxLength(35)
        .setPlaceholder(`${language.data.command['report']['topic_placeholder']}`)
        .setRequired(true);

    const TextInput2 = new TextInputComponent()
        .setCustomId('reportbug-text2')
        .setLabel(`${language.data.command['report']['message_title']}`)
        .setStyle('LONG')
        .setMinLength(10)
        .setMaxLength(500)
        .setPlaceholder(`${language.data.command['report']['message_placeholder']}`)
        .setRequired(true);

    const modal = new Modal()
        .setCustomId('reportbug')
        .setTitle('Report Bug')
        .addComponents(TextInput1, TextInput2);

    return modal;
}

export {
    genarateReportForm,
}