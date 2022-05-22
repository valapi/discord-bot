"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const IngCore = __importStar(require("@ing3kth/core"));
const controller_1 = require("../../language/controller");
exports.default = {
    customId: 'reportbug',
    execute(modal, { client }) {
        return __awaiter(this, void 0, void 0, function* () {
            const _language = (0, controller_1.getLanguageAndUndefined)(yield IngCore.Cache.output({ name: 'language', interactionId: String(modal.guildId) }));
            // main reply //
            yield modal.reply({
                content: `${_language.data.command['report']['thanks']}`,
                ephemeral: true
            });
            // on submit //
            const _Topic = modal.getTextInputValue('reportbug-text1');
            const _Message = modal.getTextInputValue('reportbug-text2');
            const OwnerOfClient = yield client.users.fetch('549231132382855189');
            yield OwnerOfClient.send({
                content: `${discord_js_1.Formatters.userMention(modal.user.id)} has reported a bug!\n\nTopic:\n**${_Topic}**\n\nMessage:\n${discord_js_1.Formatters.blockQuote(_Message)}`,
            });
        });
    }
};
//# sourceMappingURL=reportbug.js.map