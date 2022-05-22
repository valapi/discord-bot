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
const ReportModal_1 = require("../../interface/ReportModal");
const discord_modals_1 = require("discord-modals");
exports.default = {
    customId: 'reportagain',
    showDeferReply: false,
    privateMessage: true,
    execute({ interaction, language, DiscordClient }) {
        return __awaiter(this, void 0, void 0, function* () {
            //script
            const modal = (0, ReportModal_1.genarateReportForm)(language);
            yield (0, discord_modals_1.showModal)(modal, {
                client: DiscordClient,
                interaction: interaction,
            });
        });
    }
};
//# sourceMappingURL=reportagain.js.map