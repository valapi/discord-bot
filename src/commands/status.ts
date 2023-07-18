import process from "node:process";

import { SlashCommandBuilder, EmbedBuilder, time, TimestampStyles, Colors } from "discord.js";

import Command from "../core/command";

export default new Command(
    new SlashCommandBuilder().setName("status").setDescription("bot status"),
    async (interaction) => {
        const ping = Math.abs(Date.now() - interaction.createdAt.getTime()) + client.ws.ping;
        const uptime = Date.now() / 1000 - process.uptime();

        await interaction.reply({
            content: `Discord: **https://valapi.github.io/link/discord**\n`,
            embeds: [
                new EmbedBuilder()
                    .addFields(
                        {
                            name: "Uptime",
                            value: time(Math.round(uptime), TimestampStyles.RelativeTime)
                        },
                        {
                            name: "Status",
                            value: client.user.presence.status
                        },
                        {
                            name: "Ping",
                            value: `${Math.round(ping)} ms`
                        }
                    )
                    .setColor(Colors.Aqua)
            ]
        });
    }
);
