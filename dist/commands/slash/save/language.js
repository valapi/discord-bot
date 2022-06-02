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
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const IngCore = __importStar(require("@ing3kth/core"));
const controller_1 = require("../../../language/controller");
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName('language')
        .setDescription('Change Language')
        .addStringOption(option => option
        .setName('language')
        .setDescription('Language')
        .setRequired(true)
        .addChoices(
    //name is displayName
    //value is data of choice (can get from { .options.getString(); } function)
    { name: 'English', value: 'en_US' }, { name: 'Thai', value: 'th_TH' })),
    type: 'settings',
    permissions: [
        discord_js_1.Permissions.STAGE_MODERATOR,
        discord_js_1.Permissions.FLAGS.ADMINISTRATOR,
    ],
    echo: {
        command: [
            'setlanguage',
        ]
    },
    onlyGuild: true,
    execute({ interaction }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const _choice = interaction.options.getString('language');
            const guildId = String((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id);
            const _cache = yield new IngCore.Cache('language');
            const _old_language = (0, controller_1.getLanguage)(yield _cache.output(guildId));
            const _language = (0, controller_1.getLanguage)(_choice);
            if (!_language) {
                if (!_old_language) {
                    yield interaction.editReply(`Language **${_choice}** is not found!`);
                }
                else {
                    yield interaction.editReply(_old_language.data.command['language']['fail']);
                }
            }
            else {
                yield _cache.input(String(_language.name), guildId);
                yield interaction.editReply(_language.data.command['language']['succes']);
            }
        });
    },
};
//# sourceMappingURL=language.js.map