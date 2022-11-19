//import

import * as IngCore from "@ing3kth/core";
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import type { ICommandHandler } from "../../../modules";

//script

const __command: ICommandHandler.File = {
    command: new SlashCommandBuilder().setName("status").setDescription("Bot Status"),
    category: "infomation",
    async execute({ createdTime, DiscordBot, interaction }) {
        //script

        const DiscordPing = IngCore.DifferenceMillisecond(new Date(), createdTime);
        const ClientPing = Math.round(DiscordBot.ws.ping);

        const _uptime = IngCore.ToMilliseconds(process.uptime() * 1000);

        let _isInline = false;

        if (IngCore.Random(0, 10) >= 5) {
            _isInline = true;
        }

        //return

        return {
            content: `Invite Link: **https://valapi.github.io/url/bot**\nDiscord: **https://valapi.github.io/url/discord**\n`,
            embeds: [
                new EmbedBuilder()
                    .setColor(`#0099ff`)
                    .setAuthor({
                        name: `${DiscordBot.user?.tag}`,
                        iconURL: DiscordBot.user?.displayAvatarURL()
                    })
                    .addFields(
                        {
                            name: "Uptime",
                            value: `${_uptime.data.day} Days\n${_uptime.data.hour} Hours\n${_uptime.data.minute} Minutes\n${_uptime.data.second} Seconds`,
                            inline: _isInline
                        },
                        {
                            name: "Status",
                            value: `${DiscordBot.user?.presence.status}`,
                            inline: _isInline
                        },
                        {
                            name: "Ping",
                            value: `${Math.round((DiscordPing + ClientPing) / 2)} ms`,
                            inline: _isInline
                        }
                    )
                    .setTimestamp(createdTime)
                    .setFooter({
                        text: `${interaction.user.username}#${interaction.user.discriminator}`
                    })
            ]
        };
    }
};

//export

export default __command;
