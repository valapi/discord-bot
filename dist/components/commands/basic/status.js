"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const IngCore = tslib_1.__importStar(require("@ing3kth/core"));
const discord_js_1 = require("discord.js");
const __command = {
    command: (new discord_js_1.SlashCommandBuilder()
        .setName('status')
        .setDescription('Bot Status')),
    category: 'infomation',
    execute({ createdTime, DiscordBot, interaction }) {
        var _a, _b, _c;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const DiscordPing = IngCore.DifferenceMillisecond(new Date(), createdTime);
            const ClientPing = Math.round(DiscordBot.ws.ping);
            const _uptime = IngCore.ToMilliseconds(process.uptime() * 1000);
            let _isInline = false;
            if (IngCore.Random(0, 10) >= 5) {
                _isInline = true;
            }
            return {
                content: `Invite Link: **https://valapi.github.io/url/bot**\nDiscord: **https://valapi.github.io/url/discord**\n`,
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor(`#0099ff`)
                        .setAuthor({ name: `${(_a = DiscordBot.user) === null || _a === void 0 ? void 0 : _a.tag}`, iconURL: (_b = DiscordBot.user) === null || _b === void 0 ? void 0 : _b.displayAvatarURL() })
                        .addFields({ name: 'Uptime', value: `${_uptime.data.day} Days\n${_uptime.data.hour} Hours\n${_uptime.data.minute} Minutes\n${_uptime.data.second} Seconds`, inline: _isInline }, { name: 'Status', value: `${(_c = DiscordBot.user) === null || _c === void 0 ? void 0 : _c.presence.status}`, inline: _isInline }, { name: 'Ping', value: `${Math.round((DiscordPing + ClientPing) / 2)} ms`, inline: _isInline })
                        .setTimestamp(createdTime)
                        .setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}` }),
                ]
            };
        });
    }
};
exports.default = __command;
