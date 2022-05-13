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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const getStatus_1 = __importDefault(require("../../utils/getStatus"));
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName(`status`)
        .setDescription(`Bot Status`),
    permissions: [
        discord_js_1.Permissions.ALL,
    ],
    privateMessage: false,
    execute(interaction, DiscordClient, createdTime) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const getStatus = yield (0, getStatus_1.default)(DiscordClient, createdTime.getTime());
            let sendMessage = ``;
            sendMessage += `Uptime: **${getStatus.uptime.day} Days : ${getStatus.uptime.hour} Hours : ${getStatus.uptime.minute} Minutes : ${getStatus.uptime.second} Seconds**\n`;
            sendMessage += `Status: **${getStatus.status}**\n`;
            sendMessage += `Ping: **${getStatus.ping.average} ms**`;
            //embed test
            const createEmbed = new discord_js_1.MessageEmbed()
                .setColor(`#0099ff`)
                .setTitle(`/${yield interaction.commandName}`)
                .setURL(`https://ingkth.wordpress.com`)
                .setAuthor({ name: `${yield ((_a = DiscordClient.user) === null || _a === void 0 ? void 0 : _a.tag)}`, iconURL: yield ((_b = DiscordClient.user) === null || _b === void 0 ? void 0 : _b.displayAvatarURL()), url: `https://ingkth.wordpress.com` })
                .setDescription(yield sendMessage)
                .setTimestamp(createdTime)
                .setFooter({ text: `${yield interaction.user.username}#${yield interaction.user.discriminator}` });
            yield interaction.editReply({
                content: `Invite Link: **https://discord.com/api/oauth2/authorize?client_id=930354659493822515&permissions=8&scope=bot%20applications.commands**\nWebsite: **https://ingkth.wordpress.com/**\nDiscord: **https://discord.gg/pbyWbUYjyt**\n`,
                embeds: [createEmbed],
            });
        });
    }
};
//# sourceMappingURL=status.js.map