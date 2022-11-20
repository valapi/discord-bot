//import

import * as IngCore from "@ing3kth/core";
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import type { ICommandHandler } from "../../../modules";

import { encrypt, decrypt } from "../../../utils/crypto";
import { ValorDatabase, ValorInterface } from "../../../utils/database";

import { Region } from "@valapi/lib";
import { Client as ValWebClient } from "@valapi/web-client";
import { Client as ValApiCom } from "@valapi/valorant-api.com";

//script

const __command: ICommandHandler.File = {
    command: new SlashCommandBuilder()
        .setName("account")
        .setDescription("Manage Valorant Account")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("add")
                .setDescription("Add Your Valorant Account")
                .addStringOption((option) =>
                    option
                        .setName("username")
                        .setDescription("Riot Account Username")
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("password")
                        .setDescription("Riot Account Password")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("multifactor")
                .setDescription("Multi-Factor Authentication")
                .addNumberOption((option) =>
                    option.setName("verify_code").setDescription("Verify Code").setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand.setName("reconnect").setDescription("Reconnect Your Account")
        )
        .addSubcommand((subcommand) =>
            subcommand.setName("remove").setDescription("Remove Your Valorant Account")
        )
        .addSubcommand((subCommand) =>
            subCommand
                .setName("settings")
                .setDescription("Account Settings")
                .addStringOption((option) =>
                    option
                        .setName("region")
                        .setDescription("Change Your Account Region")
                        .addChoices(
                            {
                                name: Region.fromString(Region.Default.Asia_Pacific),
                                value: Region.Default.Asia_Pacific
                            },
                            {
                                name: Region.fromString(Region.Default.Brazil),
                                value: Region.Default.Brazil
                            },
                            {
                                name: Region.fromString(Region.Default.Europe),
                                value: Region.Default.Europe
                            },
                            {
                                name: Region.fromString(Region.Default.Korea),
                                value: Region.Default.Korea
                            },
                            {
                                name: Region.fromString(Region.Default.Latin_America),
                                value: Region.Default.Latin_America
                            },
                            {
                                name: Region.fromString(Region.Default.North_America),
                                value: Region.Default.North_America
                            },
                            {
                                name: Region.fromString(Region.Default.Public_Beta_Environment),
                                value: Region.Default.Public_Beta_Environment
                            }
                        )
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand.setName("get").setDescription("Get Your Valorant Account")
        ),
    category: "settings",
    onlyGuild: true,
    isPrivateMessage: true,
    echo: {
        data: [
            {
                oldName: "add",
                newName: "login"
            },
            {
                oldName: "multifactor",
                newName: "verify"
            },
            {
                oldName: "remove",
                newName: "logout"
            }
        ]
    },
    async execute({ interaction, apiKey, createdTime, language }) {
        //load

        const userId = interaction.user.id;
        const thisSubCommand = interaction.options.getSubcommand();

        const CommandLanguage = language.data.command.account;

        const _cache = new IngCore.Cache("authentications");

        const ValAccount = await ValorDatabase<ValorInterface.Account.Format>({
            name: "account",
            schema: ValorInterface.Account.Schema,
            filter: {
                discordId: userId
            },
            token: process.env["MONGO_TOKEN"]
        });

        //valorant

        const ValorantApiCom = new ValApiCom({
            language: language.name
        });

        const WebClient = new ValWebClient();

        async function ValorSave(WebClient: ValWebClient) {
            new IngCore.Cache("accounts").clear(userId);

            if (ValAccount.isFind === true) {
                await ValAccount.model.deleteMany({
                    discordId: userId
                });
            }

            await new ValAccount.model({
                account: encrypt(WebClient.cookie.ssid, apiKey),
                region: WebClient.region.live,
                discordId: userId,
                createdAt: ValAccount.data.at(0)?.createdAt || new Date()
            }).save();
        }

        async function ValorSuccess(WebClient: ValWebClient, isSave: boolean) {
            if (isSave === true) {
                _cache.clear(userId);

                await ValorSave(WebClient);
            }

            const ValorantUserInfo = await WebClient.getUserInfo();
            const puuid = ValorantUserInfo.data.sub;

            const ValorantInventory = await WebClient.Personalization.getPlayerLoadout(puuid);
            const ValorantPlayerCard = await ValorantApiCom.PlayerCards.getByUuid(
                ValorantInventory.data.Identity.PlayerCardID
            );

            //return
            return {
                content: CommandLanguage["succes"],
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#0099ff`)
                        .addFields(
                            {
                                name: `Name`,
                                value: `${ValorantUserInfo.data.acct.game_name}`,
                                inline: true
                            },
                            {
                                name: `Tag`,
                                value: `${ValorantUserInfo.data.acct.tag_line}`,
                                inline: true
                            },
                            {
                                name: "\u200B",
                                value: "\u200B"
                            },
                            {
                                name: `ID`,
                                value: `${puuid}`,
                                inline: true
                            }
                        )
                        .setThumbnail(String(ValorantPlayerCard.data.data?.displayIcon))
                        .setTimestamp(createdTime)
                        .setFooter({
                            text: `${interaction.user.username}#${interaction.user.discriminator}`
                        })
                ]
            };
        }

        //script

        if (thisSubCommand === "add") {
            //load

            const _InputUsername = interaction.options.getString("username", true);

            //script

            await WebClient.login(
                _InputUsername,
                interaction.options.getString("password", true)
            );

            if (WebClient.isMultifactorAccount === false) {
                return await ValorSuccess(WebClient, true);
            }

            _cache.input(encrypt(JSON.stringify(WebClient.toJSON()), apiKey), userId);

            //return

            return {
                content: CommandLanguage["verify"],
                embeds: [
                    new EmbedBuilder()
                        .setColor(`#0099ff`)
                        .setTitle(`/${interaction.commandName} ${thisSubCommand}`)
                        .setDescription(`Username: **${_InputUsername}**`)
                        .setTimestamp(createdTime)
                        .setFooter({
                            text: `${interaction.user.username}#${interaction.user.discriminator}`
                        })
                ]
            };
        }

        if (thisSubCommand === "multifactor") {
            //load

            const _save = _cache.output(userId);

            if (!_save) {
                return {
                    content: CommandLanguage["not_account"]
                };
            }

            //script

            WebClient.fromJSON(JSON.parse(decrypt(_save, apiKey)));

            await WebClient.verify(Number(interaction.options.getNumber("verify_code")));

            //return

            return await ValorSuccess(WebClient, true);
        }

        if (thisSubCommand === "reconnect") {
            //load

            if (ValAccount.isFind === false) {
                return {
                    content: CommandLanguage["not_account"]
                };
            }

            //script

            await WebClient.fromCookie(decrypt(ValAccount.data[0].account, apiKey));
            WebClient.config = {
                region: ValAccount.data[0].region
            };

            await WebClient.refresh();

            await ValorSave(WebClient);

            //return

            return {
                content: CommandLanguage["reconnect"]
            };
        }

        if (thisSubCommand === "remove") {
            //load

            _cache.clear(userId);

            new IngCore.Cache("accounts").clear(userId);

            //script

            if (ValAccount.isFind === false) {
                return {
                    content: CommandLanguage["not_account"]
                };
            }

            await ValAccount.model.deleteMany({
                discordId: userId
            });

            //return

            return {
                content: CommandLanguage["remove"]
            };
        }

        if (thisSubCommand === "settings") {
            //load

            if (ValAccount.isFind === false) {
                return {
                    content: CommandLanguage["not_account"]
                };
            }

            //script

            await WebClient.fromCookie(decrypt(ValAccount.data[0].account, apiKey));

            const _choice = interaction.options.getString("region") as Region.Identify;

            WebClient.config = {
                region: _choice
            };

            await ValorSave(WebClient);

            //return

            return {
                content: `__*beta*__\n\nchanged region to **${String(
                    Region.fromString(WebClient.region.live as Region.Identify)
                ).replace("_", " ")}**\n\n`
            };
        }

        if (thisSubCommand === "get") {
            //load

            if (ValAccount.isFind === false) {
                return {
                    content: CommandLanguage["not_account"]
                };
            }

            //script

            await WebClient.fromCookie(decrypt(ValAccount.data[0].account, apiKey));
            WebClient.config = {
                region: ValAccount.data[0].region
            };

            await WebClient.refresh();

            //return

            return await ValorSuccess(WebClient, false);
        }

        return {
            content: language.data.error
        };
    }
};

//export

export default __command;
