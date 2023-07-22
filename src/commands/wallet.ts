import { SlashCommandBuilder, EmbedBuilder, Colors } from "discord.js";

import { WebClient, ValorantApiCom, Locale } from "valorant.ts";

import Command from "../core/command";
import Account from "../core/account";

export default new Command(
    new SlashCommandBuilder().setName("wallet").setDescription("balance"),
    async (interaction) => {
        const saved = await Account.fetchTmp(interaction.user.id);

        if (saved) {
            const webClient = WebClient.fromJSON(saved);
            const valorantApiCom = new ValorantApiCom({
                language: Locale.Default.English_United_States
            });

            const subject = webClient.getSubject();

            const wallet = await webClient.Store.getWallet(subject);
            const currencies = await valorantApiCom.Currencies.get();

            if (!currencies.data.data) {
                await interaction.reply(Command.errorReply);
                return;
            }

            const ThumbnailId = Math.floor(
                (interaction.createdAt.getSeconds() / 60) * currencies.data.data.length
            );
            const walletEmbed = new EmbedBuilder()
                .setThumbnail(currencies.data.data.at(ThumbnailId)?.displayIcon || null)
                .setColor(Colors.Aqua);

            for (const currency of currencies.data.data) {
                const currencyValue = wallet.data.Balances[currency.uuid];

                if (!Number.isNaN(currencyValue)) {
                    walletEmbed.addFields([
                        {
                            name: currency.displayName,
                            value: currencyValue.toString()
                        }
                    ]);
                }
            }

            await interaction.reply({
                embeds: [walletEmbed]
            });
        } else {
            await interaction.reply({
                embeds: [new EmbedBuilder().setTitle("Not Found").setColor(Colors.Red)],
                ephemeral: true
            });
        }
    }
);
