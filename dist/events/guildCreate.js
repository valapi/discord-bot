"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const core_1 = require("@ing3kth/core");
exports.default = {
    name: 'guildCreate',
    once: true,
    execute(guild, _extraData) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            yield core_1.Logs.log(`<${guild.id}> join new guild`, 'info');
            //message
            let sendMessage = ``;
            sendMessage += `Joined __**${guild.name}**__!\n`;
            sendMessage += `\nUse **/help** to see all commands.`;
            const createEmbed = new discord_js_1.MessageEmbed()
                .setColor(`#0099ff`)
                .addFields({ name: `Name`, value: `${String((_a = _extraData.client.user) === null || _a === void 0 ? void 0 : _a.tag)}`, inline: true }, { name: `ID`, value: `${String((_b = _extraData.client.application) === null || _b === void 0 ? void 0 : _b.id)}`, inline: true }, { name: '\u200B', value: '\u200B' }, { name: `Report Bug`, value: `${String((yield _extraData.client.users.fetch('549231132382855189')).tag)}`, inline: true })
                .setThumbnail(String(yield ((_c = _extraData.client.user) === null || _c === void 0 ? void 0 : _c.avatarURL())))
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
            //sendMessage
            var SendGuildChannel;
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
                const CHANNEL = yield _extraData.client.users.cache.get(guild.ownerId);
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
//# sourceMappingURL=guildCreate.js.map