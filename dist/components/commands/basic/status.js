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
    async execute({ createdTime, DiscordBot, interaction }) {
        const DiscordPing = IngCore.DifferenceMillisecond(new Date(), createdTime);
        const ClientPing = Math.round(DiscordBot.ws.ping);
        const _uptime = IngCore.ToMilliseconds(process.uptime() * 1000);
        let sendMessage = ``;
        sendMessage += `Uptime: **${_uptime.data.day} Days : ${_uptime.data.hour} Hours : ${_uptime.data.minute} Minutes : ${_uptime.data.second} Seconds**\n`;
        sendMessage += `Status: **${DiscordBot.user?.presence.status}**\n`;
        sendMessage += `Ping: **${Math.round((DiscordPing + ClientPing) / 2)} ms**`;
        return {
            content: `Invite Link: **https://valapi.github.io/url/bot**\nDiscord: **https://valapi.github.io/url/discord**\n`,
            embed: [
                new discord_js_1.EmbedBuilder()
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
};
exports.default = __command;
