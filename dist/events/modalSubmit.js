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
    name: 'modalSubmit',
    once: true,
    execute(modal, _extraData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (modal.customId === 'GiveMeYourCreditCard') {
                const firstResponse = modal.getTextInputValue('CardInfo-1');
                yield modal.reply({ content: 'Congrats! Powered by discord-modals.' + discord_js_1.Formatters.codeBlock('markdown', firstResponse), ephemeral: true });
            }
        });
    },
};
//# sourceMappingURL=modalSubmit.js.map