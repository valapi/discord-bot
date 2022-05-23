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
exports.default = {
    customId: 'helplist',
    execute({ interaction, command }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            //script
            const _CommandType = interaction.values[0];
            const createEmbed = new discord_js_1.MessageEmbed()
                .setTitle(`Help - ${_CommandType}`)
                .setColor('#0099ff');
            //slash command
            let sendMessage = ``;
            for (let cmd of command.array) {
                const _cmd = command.collection.get(cmd.name);
                if (_cmd.type != (_CommandType.toLocaleLowerCase())) {
                    continue;
                }
                if (!_cmd.echo || !((_a = _cmd.echo) === null || _a === void 0 ? void 0 : _a.from)) {
                    sendMessage += `${discord_js_1.Formatters.inlineCode('/' + _cmd.data.name)} - ${_cmd.data.description}\n`;
                }
            }
            createEmbed.setDescription(sendMessage);
            // help list
            const createComponents = new discord_js_1.MessageActionRow()
                .addComponents(new discord_js_1.MessageSelectMenu()
                .setCustomId('helplist')
                .setPlaceholder('Select Command Type')
                .setMinValues(1)
                .setMaxValues(1)
                .addOptions({
                label: 'Settings',
                description: 'Change Settings',
                value: 'settings',
            }, {
                label: 'Infomation',
                description: 'Show Infomations',
                value: 'infomation',
            }, {
                label: 'Valorant',
                description: 'Valorant InGame Info',
                value: 'valorant',
            }, {
                label: 'Miscellaneous',
                description: 'Other Commands',
                value: 'miscellaneous',
            }));
            //sendMessage
            yield interaction.editReply({
                embeds: [createEmbed],
                components: [createComponents],
            });
        });
    }
};
//# sourceMappingURL=helplist.js.map