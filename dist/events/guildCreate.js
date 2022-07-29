"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const IngCore = tslib_1.__importStar(require("@ing3kth/core"));
const discord_js_1 = require("discord.js");
const __event = {
    name: 'guildCreate',
    once: false,
    async execute({ DiscordBot }, guild) {
        IngCore.Logs.log(`<${guild.id}> join new guild`, 'info');
        let sendMessage = ``;
        sendMessage += `Joined __**${guild.name}**__!\n`;
        sendMessage += `\nUse **/help** to see all commands.`;
        const createEmbed = new discord_js_1.EmbedBuilder()
            .setColor(`#0099ff`)
            .addFields({ name: `Name`, value: `${String(DiscordBot.user?.tag)}`, inline: true }, { name: `ID`, value: `${String(DiscordBot.application?.id)}`, inline: true }, { name: '\u200B', value: '\u200B' }, { name: `Report Bug`, value: `${String((await DiscordBot.users.fetch('549231132382855189')).tag)}`, inline: true })
            .setThumbnail(String(DiscordBot.user?.avatarURL()))
            .setTimestamp(new Date())
            .setFooter({ text: guild.name });
        if (guild.bannerURL()) {
            createEmbed.setImage(String(guild.bannerURL()));
        }
        else if (guild.iconURL()) {
            createEmbed.setImage(String(guild.iconURL()));
        }
        else if (guild.splashURL()) {
            createEmbed.setImage(String(guild.splashURL()));
        }
        let SendGuildChannel;
        if (guild.publicUpdatesChannelId != null) {
            SendGuildChannel = guild.publicUpdatesChannel;
        }
        else if (guild.systemChannel != null) {
            SendGuildChannel = guild.systemChannel;
        }
        else if (guild.widgetChannelId != null) {
            SendGuildChannel = guild.widgetChannel;
        }
        else if (guild.rulesChannelId != null) {
            SendGuildChannel = guild.rulesChannel;
        }
        else {
            const CHANNEL = DiscordBot.users.cache.get(guild.ownerId);
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
exports.default = __event;