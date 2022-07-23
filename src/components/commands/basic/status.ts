//import

import * as IngCore from '@ing3kth/core';
import { Permissions, SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, Formatters, ComponentType, ButtonBuilder, ButtonStyle, SelectMenuBuilder, ModalBuilder } from 'discord.js';
import type { ICommandHandler } from "../../../modules";

//script

const __command: ICommandHandler.File = {
    command: (
        new SlashCommandBuilder()
            .setName('status')
            .setDescription('Bot Status')
    ),
    category: 'miscellaneous',
    async execute({ createdTime, DiscordBot, interaction }) {
        //script

        const discord_ping = IngCore.DifferenceMillisecond(new Date(), createdTime);
        const client_ping = Math.round(DiscordBot.ws.ping);

        const _uptime = IngCore.ToMilliseconds(process.uptime() * 1000);

        let sendMessage = ``;
        sendMessage += `Uptime: **${_uptime.data.day} Days : ${_uptime.data.hour} Hours : ${_uptime.data.minute} Minutes : ${_uptime.data.second} Seconds**\n`;
        sendMessage += `Status: **${DiscordBot.user?.presence.status}**\n`;
        sendMessage += `Ping: **${Math.round((discord_ping + client_ping) / 2)} ms**`;

        // return

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