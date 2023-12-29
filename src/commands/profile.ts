import { SlashCommandBuilder, EmbedBuilder, Colors, time, TimestampStyles } from "discord.js";

import { WebClient, ValorantApiCom, Locale, Region } from "valorant.ts";

import Command from "../core/command";
import Account from "../core/account";

export default new Command(new SlashCommandBuilder().setName("profile").setDescription("user info"), async (interaction) => {
    const saved = await Account.fetch(interaction.user.id);

    if (saved) {
        const webClient = WebClient.fromJSON(saved);
        const valorantApiCom = new ValorantApiCom({
            language: Locale.Default.English_United_States
        });

        const subject = webClient.getSubject();

        const userInfo = await webClient.getUserInfo();
        const inventory = await webClient.Personalization.getPlayerLoadout(subject);

        const playerCard = await valorantApiCom.PlayerCards.getByUuid(inventory.data.Identity.PlayerCardID);
        const playerTitle = await valorantApiCom.PlayerTitles.getByUuid(inventory.data.Identity.PlayerTitleID);

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Aqua)
                    .addFields(
                        {
                            name: `Name`,
                            value: userInfo.data.acct.game_name,
                            inline: true
                        },
                        {
                            name: `Tag`,
                            value: userInfo.data.acct.tag_line,
                            inline: true
                        },
                        {
                            name: "\u200B",
                            value: "\u200B"
                        },
                        {
                            name: `Region`,
                            value: `${Region.fromString(webClient.region.live).replace("_", " ")}`,
                            inline: true
                        },
                        {
                            name: `Create`,
                            value: time(userInfo.data.acct.created_at, TimestampStyles.LongDate),
                            inline: true
                        },
                        {
                            name: "\u200B",
                            value: "\u200B"
                        },
                        {
                            name: `Card`,
                            value: String(playerCard.data.data?.displayName),
                            inline: true
                        },
                        {
                            name: `Title`,
                            value: String(playerTitle.data.data?.titleText),
                            inline: true
                        }
                    )
                    .setThumbnail(playerCard.data.data?.displayIcon || null)
            ]
        });
    } else {
        await interaction.reply({
            embeds: [new EmbedBuilder().setTitle("Not Found").setColor(Colors.Red)],
            ephemeral: true
        });
    }
});
