// import

import { SlashCommandBuilder, EmbedBuilder, ComponentType, StringSelectMenuBuilder } from "discord.js";
import type { ICommandHandler } from "../../../modules";

// script

const __command: ICommandHandler.File = {
    command: new SlashCommandBuilder().setName("help").setDescription("Show all Commands"),
    category: "infomation",
    async execute({ language }) {
        // load

        const CommandLanguage = language.data.command.help;

        // return

        return {
            embeds: [
                new EmbedBuilder()
                    .setTitle("Help")
                    .setDescription(CommandLanguage["select_category"])
                    .addFields(
                        {
                            name: "/reportbug",
                            value: "Report Bug To Developer",
                            inline: true
                        },
                        {
                            name: "/account",
                            value: "Manage Valorant Account",
                            inline: true
                        },
                        {
                            name: "/language",
                            value: "Change Language",
                            inline: true
                        }
                    )
                    .setColor("#0099ff")
            ],
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        new StringSelectMenuBuilder()
                            .setCustomId("helplist")
                            .setPlaceholder(CommandLanguage["placeholder"])
                            .setMinValues(1)
                            .setMaxValues(1)
                            .addOptions(
                                {
                                    label: "Settings",
                                    description: CommandLanguage["type_settings"],
                                    value: "settings"
                                },
                                {
                                    label: "Infomation",
                                    description: CommandLanguage["type_infomation"],
                                    value: "infomation"
                                },
                                {
                                    label: "Valorant",
                                    description: CommandLanguage["type_valorant"],
                                    value: "valorant"
                                },
                                {
                                    label: "Miscellaneous",
                                    description: CommandLanguage["type_miscellaneous"],
                                    value: "miscellaneous"
                                }
                            )
                    ]
                }
            ]
        };
    }
};

// export

export default __command;
