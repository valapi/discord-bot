//import

import * as IngCore from '@ing3kth/core';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { ICommandHandler } from "../../../modules";

//script

const __command: ICommandHandler.File = {
    command: (
        new SlashCommandBuilder()
            .setName('status')
            .setDescription('Bot Status')
    ),
    category: 'infomation',
    async execute({ createdTime, DiscordBot, interaction }) {
        //script

        const DiscordPing = IngCore.DifferenceMillisecond(new Date(), createdTime);
        const ClientPing = Math.round(DiscordBot.ws.ping);

        const _uptime = IngCore.ToMilliseconds(process.uptime() * 1000);

        let sendMessage = ``;
        sendMessage += `Uptime: **${_uptime.data.day} Days : ${_uptime.data.hour} Hours : ${_uptime.data.minute} Minutes : ${_uptime.data.second} Seconds**\n`;
        sendMessage += `Status: **${DiscordBot.user?.presence.status}**\n`;
        sendMessage += `Ping: **${Math.round((DiscordPing + ClientPing) / 2)} ms**`;

        //return

        return {
            content: `Invite Link: **https://valapi.github.io/url/bot**\nDiscord: **https://valapi.github.io/url/discord**\n`,
            embed: [
                new EmbedBuilder()
                    .setColor(`#0099ff`)
                    .setTitle(`/${interaction.commandName}`)
                    .setURL(`https://valapi.github.io/url/discord`)
                    .setAuthor({ name: `${DiscordBot.user?.tag}`, iconURL: DiscordBot.user?.displayAvatarURL() })
                    .setDescription(sendMessage)
                    .setTimestamp(createdTime)
                    .setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}` }),
            ],
        };
    }
}

//export

export default __command;