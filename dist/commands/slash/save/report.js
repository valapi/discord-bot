"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const builders_1 = require("@discordjs/builders");
const discord_modals_1 = require("discord-modals");
const ReportModal_1 = require("../../../interface/ReportModal");
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName('report')
        .setDescription('Report Bug To Developer'),
    type: 'miscellaneous',
    showDeferReply: false,
    privateMessage: true,
    inDevlopment: true,
    echo: {
        command: [
            'reportbug',
        ]
    },
    execute({ interaction, DiscordClient, language }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const modal = (0, ReportModal_1.genarateReportForm)(language);
            yield (0, discord_modals_1.showModal)(modal, {
                client: DiscordClient,
                interaction: interaction,
            });
        });
    },
};
