import { SlashCommandBuilder, EmbedBuilder, Colors } from "discord.js";

import { WebClient, ValorantApiCom, Locale } from "valorant.ts";

import Command from "../core/command";
import Account from "../core/account";

export default new Command(
    new SlashCommandBuilder().setName("inventory").setDescription("collection"),
    async (interaction) => {
        const saved = await Account.fetchTmp(interaction.user.id);

        if (saved) {
            const webClient = WebClient.fromJSON(saved);
            const valorantApiCom = new ValorantApiCom({
                language: Locale.Default.English_United_States
            });

            const subject = webClient.getSubject();

            await interaction.deferReply();

            const inventory = await webClient.Personalization.getPlayerLoadout(subject);

            const inventoryEmbed = new EmbedBuilder().setColor(Colors.Aqua);

            // card
            const cardData = await valorantApiCom.PlayerCards.getByUuid(
                inventory.data.Identity.PlayerCardID
            );
            if (cardData.data.data) {
                inventoryEmbed.addFields({
                    name: "Player Card",
                    value: cardData.data.data.displayName,
                    inline: true
                });
                inventoryEmbed.setImage(cardData.data.data.wideArt);
            }

            // title
            const titleData = await valorantApiCom.PlayerTitles.getByUuid(
                inventory.data.Identity.PlayerTitleID
            );
            if (titleData.data.data) {
                inventoryEmbed.addFields({
                    name: "Player Title",
                    value: `${titleData.data.data.displayName} - ${titleData.data.data.titleText}`,
                    inline: true
                });
            }

            // * add space
            inventoryEmbed.addFields({
                name: "\u200B",
                value: "\u200B"
            });

            // gun
            const gunNames: Array<string> = [];
            for (const gun of inventory.data.Guns) {
                const gunData = await valorantApiCom.Weapons.getSkinByUuid(gun.SkinID);
                if (gunData.data.data) {
                    gunNames.push(gunData.data.data.displayName);
                }
            }
            inventoryEmbed.addFields({
                name: "Weapons",
                value: gunNames.join("\n"),
                inline: true
            });

            // spray
            const sprayNames: Array<string> = [];
            const sprayIcon: Array<string> = [];
            for (const spray of inventory.data.Sprays) {
                const sprayData = await valorantApiCom.Sprays.getByUuid(spray.SprayID);
                if (sprayData.data.data) {
                    sprayNames.push(sprayData.data.data.displayName);
                    sprayIcon.push(sprayData.data.data.displayIcon);
                }
            }
            const sprayIconId = Math.floor(
                (interaction.createdAt.getSeconds() / 60) * sprayIcon.length
            );
            inventoryEmbed.setThumbnail(sprayIcon.at(sprayIconId) || null);
            inventoryEmbed.addFields({
                name: "Sprays",
                value: sprayNames.join("\n"),
                inline: true
            });

            await interaction.editReply({
                embeds: [inventoryEmbed]
            });
        } else {
            await interaction.reply({
                embeds: [new EmbedBuilder().setTitle("Not Found").setColor(Colors.Red)],
                ephemeral: true
            });
        }
    }
);
