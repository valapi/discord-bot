"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const IngCore = tslib_1.__importStar(require("@ing3kth/core"));
const discord_js_1 = require("discord.js");
const __event = {
    name: 'guildCreate',
    once: false,
    execute({ DiscordBot }, guild) {
        var _a, _b, _c;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            IngCore.Logs.log(`<${guild.id}> join new guild`, 'info');
            let sendMessage = ``;
            sendMessage += `Joined __**${guild.name}**__!\n`;
            sendMessage += `\nUse **/help** to see all commands.`;
            const createEmbed = new discord_js_1.EmbedBuilder()
                .setColor(`#0099ff`)
                .addFields({ name: `Name`, value: `${String((_a = DiscordBot.user) === null || _a === void 0 ? void 0 : _a.tag)}`, inline: true }, { name: `ID`, value: `${String((_b = DiscordBot.application) === null || _b === void 0 ? void 0 : _b.id)}`, inline: true }, { name: '\u200B', value: '\u200B' }, { name: `Report Bug`, value: `${String((yield DiscordBot.users.fetch('549231132382855189')).tag)}`, inline: true })
                .setThumbnail(String((_c = DiscordBot.user) === null || _c === void 0 ? void 0 : _c.avatarURL()))
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
                yield (CHANNEL === null || CHANNEL === void 0 ? void 0 : CHANNEL.send({
                    content: sendMessage,
                    embeds: [createEmbed],
                }));
                return;
            }
            yield (SendGuildChannel === null || SendGuildChannel === void 0 ? void 0 : SendGuildChannel.send({
                content: sendMessage,
                embeds: [createEmbed],
            }));
        });
    },
};
exports.default = __event;
