import { SlashCommandBuilder, EmbedBuilder, Colors } from "discord.js";

import { WebClient, ValorantApiCom, Locale } from "valorant.ts";

import Command from "../core/command";
import Account from "../core/account";

export default new Command(new SlashCommandBuilder().setName("rank").setDescription("competitive tier"), async (interaction) => {
    const saved = await Account.fetch(interaction.user.id);

    if (saved) {
        const webClient = WebClient.fromJSON(saved);
        const valorantApiCom = new ValorantApiCom({
            language: Locale.Default.English_United_States
        });

        const subject = webClient.getSubject();

        const competitiveUpdate = await webClient.MMR.fetchCompetitiveUpdates(subject);
        const lastCompetitiveUpdate = competitiveUpdate.data.Matches.find((match) => match.RankedRatingEarned !== 0);
        if (!lastCompetitiveUpdate) {
            await interaction.reply({
                embeds: [new EmbedBuilder().setTitle("Play more competitive gamemode :)").setColor(Colors.DarkRed)],
                ephemeral: true
            });
            return;
        }

        const competitiveTiers = await valorantApiCom.CompetitiveTiers.get();
        if (!competitiveTiers.data.data) {
            await interaction.reply(Command.errorReply);
            return;
        }

        const playerTier = lastCompetitiveUpdate.TierAfterUpdate || lastCompetitiveUpdate.TierBeforeUpdate;
        const playerRank = lastCompetitiveUpdate.RankedRatingAfterUpdate || lastCompetitiveUpdate.RankedRatingBeforeUpdate;

        const rankEmbed = new EmbedBuilder();

        tiersloop: {
            for (const tiers of competitiveTiers.data.data) {
                for (const tier of tiers.tiers) {
                    if (tier.tier === playerTier) {
                        rankEmbed
                            .addFields(
                                {
                                    name: "Rank",
                                    value: tier.tierName
                                },
                                {
                                    name: "\u200B",
                                    value: "\u200B"
                                },
                                {
                                    name: "Rating",
                                    value: `${playerRank} RR`
                                }
                            )
                            .setColor(`#${tier.color.slice(0, -2)}`)
                            .setThumbnail(tier.largeIcon);
                    }

                    break tiersloop;
                }
            }
        }

        await interaction.reply({
            embeds: [rankEmbed]
        });
    } else {
        await interaction.reply({
            embeds: [new EmbedBuilder().setTitle("Not Found").setColor(Colors.Red)],
            ephemeral: true
        });
    }
});
