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
            let sendMessage = ``;
            sendMessage += `Uptime: **${_uptime.data.day} Days : ${_uptime.data.hour} Hours : ${_uptime.data.minute} Minutes : ${_uptime.data.second} Seconds**\n`;
            sendMessage += `Status: **${(_a = DiscordBot.user) === null || _a === void 0 ? void 0 : _a.presence.status}**\n`;
            sendMessage += `Ping: **${Math.round((DiscordPing + ClientPing) / 2)} ms**`;
            return {
                content: `Invite Link: **https://valapi.github.io/url/bot**\nDiscord: **https://valapi.github.io/url/discord**\n`,
                embed: [
                    new discord_js_1.EmbedBuilder()
                        .setColor(`#0099ff`)
                        .setTitle(`/${interaction.commandName}`)
                        .setURL(`https://valapi.github.io/url/discord`)
                        .setAuthor({ name: `${(_b = DiscordBot.user) === null || _b === void 0 ? void 0 : _b.tag}`, iconURL: (_c = DiscordBot.user) === null || _c === void 0 ? void 0 : _c.displayAvatarURL() })
                        .setDescription(sendMessage)
                        .setTimestamp(createdTime)
                        .setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}` }),
                ],
            };
        });
    }
};
exports.default = __command;
