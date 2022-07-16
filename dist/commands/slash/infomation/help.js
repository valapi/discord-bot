"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName('help')
        .setDescription('Show all Commands'),
    type: 'infomation',
    execute({ interaction }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
