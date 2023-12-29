import { SlashCommandBuilder, EmbedBuilder, Colors, bold, time, TimestampStyles } from "discord.js";

import { WebClient, ValorantApiCom, Locale } from "valorant.ts";

import Command from "../core/command";
import Account from "../core/account";

export default new Command(new SlashCommandBuilder().setName("quest").setDescription("daily quest"), async (interaction) => {
    const saved = await Account.fetch(interaction.user.id);

    if (saved) {
        const webClient = WebClient.fromJSON(saved);
        const valorantApiCom = new ValorantApiCom({
            language: Locale.Default.English_United_States
        });

        const subject = webClient.getSubject();

        await interaction.deferReply();

        // checkpoint

        const dailyTicket = await webClient.DailyTicket.get(subject);

        const checkpointEmbed = new EmbedBuilder()
            .setTitle("Checkpoint")
            .setDescription(
                `Time Remaining: ${bold(
                    time(Math.round(Date.now() / 1000 + dailyTicket.data.DailyRewards.RemainingLifetimeSeconds), TimestampStyles.RelativeTime)
                )}`
            );

        const milestoneScore = dailyTicket.data.DailyRewards.Milestones.map((milestone, index) => {
            checkpointEmbed.addFields({
                name: `Milestone ${index + 1}`,
                value: `${["🟩", "🟩", "🟩", "🟩"].slice(0, milestone.Progress).join(" ")} ${["🟥", "🟥", "🟥", "🟥"]
                    .slice(0, 4 - milestone.Progress)
                    .join(" ")}`
            });

            return milestone.Progress;
        });
        const milestoneAverageScore = milestoneScore.reduce((previous, current) => previous + current) / milestoneScore.length;
        switch (Math.floor(milestoneAverageScore)) {
            case 0: {
                checkpointEmbed.setColor(Colors.DarkRed);
                break;
            }
            case 1: {
                checkpointEmbed.setColor(Colors.Red);
                break;
            }
            case 2: {
                checkpointEmbed.setColor(Colors.Yellow);
                break;
            }
            case 3: {
                checkpointEmbed.setColor(Colors.Green);
                break;
            }
            case 4: {
                checkpointEmbed.setColor(Colors.DarkGreen);
                break;
            }
        }

        // weekly mission

        const contract = await webClient.Contracts.fetch(subject);

        const missionEmbed = new EmbedBuilder().setTitle("Weekly Mission");

        let totalCompleteMission = 0;
        for (const mission of contract.data.Missions) {
            const missionData = await valorantApiCom.Missions.getByUuid(mission.ID);
            if (!missionData.data.data) continue;

            const missionProgress = mission.Objectives[missionData.data.data.objectives[0].objectiveUuid];

            missionEmbed.addFields({
                name: missionData.data.data.title,
                value: `${missionProgress === missionData.data.data.progressToComplete ? missionProgress : bold(missionProgress.toString())} / ${
                    missionData.data.data.progressToComplete
                }`
            });
            totalCompleteMission += 1;
        }

        switch (totalCompleteMission) {
            case 0: {
                missionEmbed.setColor(Colors.Red);
                break;
            }
            case 1: {
                missionEmbed.setColor(Colors.Yellow);
                break;
            }
            case 2: {
                missionEmbed.setColor(Colors.Green);
                break;
            }
            case 3: {
                missionEmbed.setColor(Colors.DarkGreen);
                break;
            }
        }

        await interaction.editReply({
            embeds: [checkpointEmbed, missionEmbed]
        });
    } else {
        await interaction.reply({
            embeds: [new EmbedBuilder().setTitle("Not Found").setColor(Colors.Red)],
            ephemeral: true
        });
    }
});
