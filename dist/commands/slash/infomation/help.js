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
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName('help')
        .setDescription('Show all Commands'),
    type: 'infomation',
    execute({ interaction, language, DiscordClient, command }) {
        return __awaiter(this, void 0, void 0, function* () {
            //script
            const createEmbed = new discord_js_1.MessageEmbed()
                .setTitle('Help')
                .addFields({
                name: 'reportbug',
                value: 'Report Bug To Developer',
                inline: true,
            }, {
                name: 'account',
                value: 'Manage Valorant Account',
                inline: true,
            }, {
                name: 'language',
                value: 'Change Language',
                inline: true,
            })
                .setColor('#0099ff');
            //slash command
            let sendMessage = ``;
            command.array.forEach(cmd => {
                const _cmd = command.collection.get(cmd.name);
                if (!_cmd.echo || !_cmd.echo.from) {
                    switch (_cmd.data.name) {
                        case 'report':
                            break;
                        case 'help':
                            break;
                        case 'ping':
                            break;
                        case 'status':
                            break;
                        default:
                            sendMessage += `${discord_js_1.Formatters.inlineCode('/' + _cmd.data.name)} - ${_cmd.data.description}\n`;
                            break;
                    }
                }
            });
            createEmbed.setDescription(sendMessage);
            yield interaction.editReply({
                embeds: [createEmbed],
            });
        });
    },
};
//# sourceMappingURL=help.js.map