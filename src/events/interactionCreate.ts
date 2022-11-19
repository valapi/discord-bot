//import

import type { IEventHandler, ICommandHandler, IMenuHandler, IModalHandler } from "../modules";

import * as process from "process";
import * as IngCore from "@ing3kth/core";

import { getLanguageAndUndefined } from "../lang";
import {
    type CommandInteraction,
    type SelectMenuInteraction,
    type ModalSubmitInteraction,
    InteractionType,
    SlashCommandBuilder,
    WebhookEditMessageOptions,
    InteractionReplyOptions
} from "discord.js";

import { genarateApiKey } from "../utils/crypto";

//script

const __event: IEventHandler.File<"interactionCreate"> = {
    name: "interactionCreate",
    once: false,
    async execute({ _SlashCommand, _Menu, _Modal, _DevelopmentMode, DiscordBot }, interaction) {
        if (
            _DevelopmentMode === true &&
            interaction.guild?.id !== String(process.env["GUILD_ID"])
        ) {
            return;
        }

        const createdTime = new Date();

        const language = getLanguageAndUndefined(
            IngCore.Cache.output({
                name: "languages",
                interactionId: String(interaction.guildId)
            })
        );

        let _isInteractionReplied = false;
        async function interactionReply(
            interaction: CommandInteraction | SelectMenuInteraction | ModalSubmitInteraction,
            data: InteractionReplyOptions
        ) {
            if (_isInteractionReplied === false) {
                await interaction.reply({
                    ...data,
                    ...{
                        tts: false,
                        fetchReply: true
                    }
                });

                _isInteractionReplied = true;
            } else {
                await interaction.editReply(data);
            }
        }

        if (interaction.isChatInputCommand()) {
            /**
             * Slash Command
             */
            const command: ICommandHandler.File = {
                ...{
                    command: new SlashCommandBuilder()
                        .setName("default")
                        .setDescription("Default command"),
                    category: "miscellaneous",
                    permissions: [],
                    isPrivateMessage: false,
                    onlyGuild: false,
                    inDevlopment: false,
                    showDeferReply: true,
                    execute: async () => {
                        return {
                            content: "This is Default message."
                        };
                    }
                },
                ..._SlashCommand.Collection.get(interaction.commandName)
            };

            //load

            if (command.showDeferReply === true) {
                await interaction.deferReply({
                    ephemeral: command.isPrivateMessage,
                    fetchReply: true
                });

                _isInteractionReplied = true;
            }

            try {
                if (command.inDevlopment === true && interaction.user.id !== "549231132382855189") {
                    await interactionReply(interaction, {
                        content: language.data["dev_cmd"] || "This command is in development."
                    });

                    return;
                }

                if (!interaction.guild && command.onlyGuild === true) {
                    await interactionReply(interaction, {
                        content:
                            language.data["not_guild"] ||
                            "This slash command are only available in server."
                    });

                    return;
                }

                if (command.echo) {
                    if (command.echo.from) {
                        interaction.commandName = command.echo.from;

                        if (interaction.command) {
                            interaction.command.name = command.echo.from;
                        }
                    }

                    if (command.echo.subCommand && command.echo.subCommand.isSubCommand === true) {
                        interaction.options.getSubcommand = () => {
                            return String(command.echo?.subCommand?.baseCommand);
                        };
                    }
                }

                if (
                    command.permissions &&
                    !interaction.memberPermissions?.has(command.permissions)
                ) {
                    await interactionReply(interaction, {
                        content:
                            language.data["not_permission"] ||
                            `You don't have permission to use this command.`
                    });

                    return;
                }

                //execute

                IngCore.Logs.log(
                    `<${interaction.user.id}> <command> ${interaction.commandName}\x1b[0m`,
                    "info"
                );

                const TheCommand = await command.execute({
                    interaction,
                    DiscordBot,
                    createdTime,
                    language,
                    apiKey: genarateApiKey(
                        `${interaction.user.id}${interaction.user.createdTimestamp}`,
                        `${interaction.guild?.id}${interaction.guild?.ownerId}${interaction.guild?.createdTimestamp}`,
                        String(process.env["PUBLIC_KEY"])
                    )
                });

                if (TheCommand) {
                    await interactionReply(interaction, TheCommand);
                } else {
                    await IngCore.Wait(10 * 1000);
                }

                IngCore.Logs.log(
                    `<${interaction.user.id}> <command> ${
                        interaction.commandName
                    } [${IngCore.DifferenceMillisecond(new Date().getTime(), createdTime)}]\x1b[0m`,
                    "info"
                );
            } catch (error) {
                //error

                if (_DevelopmentMode === true) {
                    IngCore.Logs.log(error, "error");
                } else {
                    IngCore.Logs.log(error, "error");
                }

                await interactionReply(interaction, {
                    content:
                        language.data["error"] || `Something Went Wrong, Please Try Again Later`,
                    embeds: [],
                    components: [],
                    files: []
                });
            }
        } else if (interaction.isSelectMenu()) {
            /**
             * Select Menu
             */
            const menu: IMenuHandler.File = {
                ...{
                    customId: "default",
                    replyMode: "edit",
                    execute: async () => {
                        return {
                            content: "This is Default message."
                        };
                    }
                },
                ..._Menu.get(interaction.customId)
            };

            //load

            if (menu.replyMode === "edit") {
                await interaction.deferUpdate({
                    fetchReply: true
                });

                _isInteractionReplied = true;
            } else if (menu.replyMode === "new") {
                await interaction.deferReply({
                    fetchReply: true
                });
            }

            try {
                //execute

                IngCore.Logs.log(
                    `<${interaction.user.id}> <menu> ${interaction.customId}\x1b[0m`,
                    "info"
                );

                const TheMenu = await menu.execute({
                    interaction,
                    DiscordBot,
                    language,
                    _SlashCommand
                });

                await interactionReply(interaction, TheMenu);

                IngCore.Logs.log(
                    `<${interaction.user.id}> <menu> ${
                        interaction.customId
                    } [${IngCore.DifferenceMillisecond(new Date().getTime(), createdTime)}]\x1b[0m`,
                    "info"
                );
            } catch (error) {
                //error

                if (_DevelopmentMode === true) {
                    IngCore.Logs.log(error, "error");
                } else {
                    IngCore.Logs.log(error, "error");
                }

                await interactionReply(interaction, {
                    content:
                        language.data["error"] || `Something Went Wrong, Please Try Again Later`,
                    embeds: [],
                    components: [],
                    files: []
                });
            }
        }

        if (interaction.type === InteractionType.ModalSubmit) {
            /**
             * Modal
             */
            const modal: IModalHandler.File = {
                ...{
                    customId: "default",
                    execute: async () => {
                        return {
                            content: "This is Default message."
                        };
                    }
                },
                ..._Modal.get(interaction.customId)
            };

            //load

            try {
                //execute

                IngCore.Logs.log(
                    `<${interaction.user.id}> <modal> ${interaction.customId}\x1b[0m`,
                    "info"
                );

                if (_isInteractionReplied === true) {
                    interaction.editReply({
                        content:
                            language.data["error"] || `Something Went Wrong, Please Try Again Later`
                    });

                    return;
                }

                const TheModal = await modal.execute({
                    interaction,
                    DiscordBot,
                    language
                });

                await interaction.reply({
                    ...TheModal,
                    ...{
                        tts: false,
                        fetchReply: true
                    }
                });
                _isInteractionReplied = true;

                IngCore.Logs.log(
                    `<${interaction.user.id}> <modal> ${
                        interaction.customId
                    } [${IngCore.DifferenceMillisecond(new Date().getTime(), createdTime)}]\x1b[0m`,
                    "info"
                );
            } catch (error) {
                //error

                if (_DevelopmentMode === true) {
                    IngCore.Logs.log(error, "error");
                } else {
                    IngCore.Logs.log(error, "error");
                }

                await interactionReply(interaction, {
                    content:
                        language.data["error"] || `Something Went Wrong, Please Try Again Later`,
                    embeds: [],
                    components: [],
                    files: []
                });
            }
        }
    }
};

//export

export default __event;
