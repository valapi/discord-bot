// import

import { ComponentType, ModalBuilder, SlashCommandBuilder, TextInputStyle } from "discord.js";
import type { ICommandHandler } from "../../../modules";

// script

const __command: ICommandHandler.File = {
    command: new SlashCommandBuilder().setName("report").setDescription("Report Bug To Developer"),
    category: "miscellaneous",
    isPrivateMessage: true,
    inDevlopment: true,
    showDeferReply: false,
    echo: {
        data: ["reportbug"]
    },
    async execute({ interaction, language }) {
        // load

        const CommandLanguage = language.data.command.report;

        // script

        const MyModal = new ModalBuilder()
            .setCustomId("reportbug")
            .setTitle("Report Bug")
            .addComponents(
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.TextInput,
                            custom_id: "reportbug_topic",
                            label: `${CommandLanguage["topic_title"]}`,
                            placeholder: `${CommandLanguage["topic_placeholder"]}`,
                            required: true,
                            style: TextInputStyle.Short,
                            min_length: 5,
                            max_length: 75
                        }
                    ]
                },
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.TextInput,
                            custom_id: "reportbug_message",
                            label: `${CommandLanguage["message_title"]}`,
                            placeholder: `${CommandLanguage["message_placeholder"]}`,
                            required: true,
                            style: TextInputStyle.Paragraph,
                            min_length: 10,
                            max_length: 1000
                        }
                    ]
                }
            );

        await interaction.showModal(MyModal);

        // return

        return {
            content: language.data.error
        };
    }
};

// export

export default __command;
