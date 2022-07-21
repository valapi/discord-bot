import { type Guild, type TextChannel, MessageEmbed } from 'discord.js';
import type { EventExtraData } from '../interface/EventData';

import { Logs } from '@ing3kth/core';

export default {
    name: 'guildCreate',
    once: true,
    async execute(guild: Guild, _extraData: EventExtraData) {
        Logs.log(`<${guild.id}> join new guild`, 'info');

        //message
        let sendMessage = ``;
        sendMessage += `Joined __**${guild.name}**__!\n`
        sendMessage += `\nUse **/help** to see all commands.`

        const createEmbed = new MessageEmbed()
            .setColor(`#0099ff`)
            .addFields(
                { name: `Name`, value: `${String(_extraData.client.user?.tag)}`, inline: true },
                { name: `ID`, value: `${String(_extraData.client.application?.id)}`, inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: `Report Bug`, value: `${String((await _extraData.client.users.fetch('549231132382855189')).tag)}`, inline: true },
            )
            .setThumbnail(String(await _extraData.client.user?.avatarURL()))
            .setTimestamp(new Date())
            .setFooter({ text: guild.name });

        if (guild.bannerURL()) {
            createEmbed.setImage(String(guild.bannerURL()));
        } else if (guild.iconURL()) {
            createEmbed.setImage(String(guild.iconURL()));
        } else if (guild.splashURL()) {
            createEmbed.setImage(String(guild.splashURL()));
        }

        //sendMessage
        var SendGuildChannel: TextChannel | null;

        if (guild.publicUpdatesChannelId != null) { SendGuildChannel = guild.publicUpdatesChannel }
        else if (guild.systemChannel != null) { SendGuildChannel = guild.systemChannel }
        else if (guild.widgetChannelId != null) { SendGuildChannel = guild.widgetChannel }
        else if (guild.rulesChannelId != null) { SendGuildChannel = guild.rulesChannel }
        else {
            const CHANNEL = _extraData.client.users.cache.get(guild.ownerId);

            await CHANNEL?.send({
                content: sendMessage,
                embeds: [createEmbed],
            });
            return;
        }

        await SendGuildChannel?.send({
            content: sendMessage,
            embeds: [createEmbed],
        });
    },
};