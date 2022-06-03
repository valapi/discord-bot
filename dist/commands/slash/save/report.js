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
        return __awaiter(this, void 0, void 0, function* () {
            //create model
            const modal = (0, ReportModal_1.genarateReportForm)(language);
            yield (0, discord_modals_1.showModal)(modal, {
                client: DiscordClient,
                interaction: interaction,
            });
        });
    },
};
//# sourceMappingURL=report.js.map