/* eslint-disable */

import { SlashCommandBuilder, EmbedBuilder, Colors } from "discord.js";

import { WebClient, ValorantApiCom, Locale } from "valorant.ts";

import Command from "../core/command";
import Account from "../core/account";

export default new Command(
    new SlashCommandBuilder().setName("quest").setDescription("daily quest"),
    async (interaction) => {
        const saved = await Account.fetchTmp(interaction.user.id);

        if (saved) {
            const webClient = WebClient.fromJSON(saved);
            const valorantApiCom = new ValorantApiCom({
                language: Locale.Default.English_United_States
            });

            const subject = webClient.getSubject();

            // checkpoint

            const dailyTicket = await webClient.DailyTicket.get(subject);
            const dailyTicketEmbed = new EmbedBuilder()
                .setTitle("Checkpoint");

            let allCheckpoint = 0;
            dailyTicket.data.DailyRewards.Milestones.forEach((milestone, index) => {
                allCheckpoint += milestone.Progress;

                dailyTicketEmbed.addFields({
                    name: index.toString(),
                    value: milestone.Progress.toString()
                });
            });
            allCheckpoint += 4;

            // weekly mission

            const contract = await webClient.Contracts.fetch(subject);
        } else {
            await interaction.reply({
                embeds: [new EmbedBuilder().setTitle("Not Found").setColor(Colors.Red)],
                ephemeral: true
            });
        }
    }
);
