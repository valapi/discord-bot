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
    execute({ interaction }) {
        return __awaiter(this, void 0, void 0, function* () {
            //script
            const createEmbed = new discord_js_1.MessageEmbed()
                .setTitle('Help')
                .setDescription('You can select one of the categories below')
                .addFields({
                name: '/reportbug',
                value: 'Report Bug To Developer',
                inline: true,
            }, {
                name: '/account',
                value: 'Manage Valorant Account',
                inline: true,
            }, {
                name: '/language',
                value: 'Change Language',
                inline: true,
            })
                .setColor('#0099ff');
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
            yield interaction.editReply({
                embeds: [createEmbed],
                components: [createComponents],
            });
        });
    },
};
//# sourceMappingURL=help.js.map