import { SlashCommandBuilder } from '@discordjs/builders';
import { Permissions, MessageAttachment, MessageEmbed, Formatters } from 'discord.js';
import type { CustomSlashCommands } from '../../interface/SlashCommand';

import getStatusFunction from '../../utils/getStatus';

export default {
    data: new SlashCommandBuilder()
        .setName(`status`)
        .setDescription(`Bot Status`),
    async execute({ interaction, DiscordClient, createdTime }) {
        const getStatus = await getStatusFunction(DiscordClient, createdTime.getTime());

        let sendMessage = ``;
        sendMessage += `Uptime: **${getStatus.uptime.day} Days : ${getStatus.uptime.hour} Hours : ${getStatus.uptime.minute} Minutes : ${getStatus.uptime.second} Seconds**\n`;
        sendMessage += `Status: **${getStatus.status}**\n`;
        sendMessage += `Ping: **${getStatus.ping.average} ms**`;

        //embed test
        const createEmbed = new MessageEmbed()
            .setColor(`#0099ff`)
            .setTitle(`/${await interaction.commandName}`)
            .setURL(`https://ingkth.wordpress.com`)
            .setAuthor({ name: `${await DiscordClient.user?.tag}`, iconURL: await DiscordClient.user?.displayAvatarURL(), url: `https://ingkth.wordpress.com` })
            .setDescription(await sendMessage)
            .setTimestamp(createdTime)
            .setFooter({ text: `${await interaction.user.username}#${await interaction.user.discriminator}` });

        await interaction.editReply({
            content: `Invite Link: **https://discord.com/api/oauth2/authorize?client_id=930354659493822515&permissions=8&scope=bot%20applications.commands**\nWebsite: **https://ingkth.wordpress.com/**\nDiscord: **https://discord.gg/pbyWbUYjyt**\n`,
            embeds: [createEmbed],
        });
    }
} as CustomSlashCommands;