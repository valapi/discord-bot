"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ReportModal_1 = require("../../interface/ReportModal");
const discord_modals_1 = require("discord-modals");
exports.default = {
    customId: 'reportagain',
    showDeferReply: false,
    privateMessage: true,
    execute({ interaction, language, DiscordClient }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            //script
            const modal = (0, ReportModal_1.genarateReportForm)(language);
            yield (0, discord_modals_1.showModal)(modal, {
                client: DiscordClient,
                interaction: interaction,
            });
        });
    }
};
