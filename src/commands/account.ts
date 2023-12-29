import {
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder,
    SlashCommandStringOption,
    SlashCommandIntegerOption,
    EmbedBuilder,
    bold,
    inlineCode,
    time,
    TimestampStyles,
    Colors
} from "discord.js";

import { Region } from "valorant.ts";

import Command from "../core/command";
import Account from "../core/account";

export default new Command(
    new SlashCommandBuilder()
        .setName("account")
        .setDescription("manage your account")
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("login")
                .setDescription("add account")
                .addStringOption(new SlashCommandStringOption().setName("username").setDescription("Riot Username").setRequired(true))
                .addStringOption(new SlashCommandStringOption().setName("password").setDescription("password").setRequired(true))
        )
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("verify")
                .setDescription("verify account")
                .addIntegerOption(
                    new SlashCommandIntegerOption().setName("code").setDescription("verification code").setMinValue(0).setMaxValue(999999).setRequired(true)
                )
        )
        .addSubcommand(new SlashCommandSubcommandBuilder().setName("get").setDescription("check account"))
        .addSubcommand(new SlashCommandSubcommandBuilder().setName("remove").setDescription("remove account")),
    async (interaction) => {
        const _subcommand = interaction.options.getSubcommand();

        const account = new Account(interaction.user.id);

        function errorReply() {
            return {
                embeds: [new EmbedBuilder().setTitle("Authentication Error").setColor(Colors.Red)],
                ephemeral: true
            };
        }
        function successReply() {
            return {
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Success !!")
                        .setDescription(`your account was add to database\n\nUUID: ${bold(account.client.getSubject())}`)
                        .setColor(Colors.Green)
                ],
                ephemeral: true
            };
        }
        function notFoundReply() {
            return {
                embeds: [new EmbedBuilder().setTitle("Not Found").setColor(Colors.Red)],
                ephemeral: true
            };
        }

        if (_subcommand === "login") {
            const username = interaction.options.getString("username", true);
            const password = interaction.options.getString("password", true);

            await account.client.login(username, password);

            if (account.client.authenticationInfo.isError) {
                await interaction.reply(errorReply());
                return;
            }

            await account.set();

            if (account.client.authenticationInfo.isMultifactor) {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Multi-Factor Authentication")
                            .setDescription(`multi-factor is enable please do ${inlineCode("/account verify code:")} after this`)
                            .setColor(Colors.Yellow)
                    ],
                    ephemeral: true
                });
                return;
            } else {
                await interaction.reply(successReply());
                return;
            }
        } else if (_subcommand === "verify") {
            const saved = account.get();

            if (saved) {
                account.client.fromJSON(saved);

                const verificationCode = interaction.options.getInteger("code", true);
                await account.client.verify(verificationCode);

                if (account.client.authenticationInfo.isError) {
                    await interaction.reply(errorReply());
                    return;
                }

                await account.set();

                await interaction.reply(successReply());
            } else {
                await interaction.reply(notFoundReply());
                return;
            }
        } else if (_subcommand === "get") {
            const saved = await account.fetch();

            if (saved) {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                `UUID: ${bold(account.client.getSubject())}\nRegion: ${bold(
                                    Region.fromString(account.client.region.live).replace("_", " ")
                                )}\nToken Expiration: ${bold(time(Math.round(account.client.getExpirationDate() / 1000), TimestampStyles.RelativeTime))}`
                            )
                            .setColor(Colors.Aqua)
                    ],
                    ephemeral: true
                });
            } else {
                await interaction.reply(notFoundReply());
                return;
            }
        } else if (_subcommand === "remove") {
            await account.remove();

            await interaction.reply({
                embeds: [new EmbedBuilder().setTitle("Removed").setColor(Colors.Red)],
                ephemeral: true
            });
        }
    }
);
