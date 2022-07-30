"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const IngCore = tslib_1.__importStar(require("@ing3kth/core"));
const discord_js_1 = require("discord.js");
const lang_1 = require("../../../lang");
const __command = {
    command: (new discord_js_1.SlashCommandBuilder()
        .setName('language')
        .setDescription('Change Language')
        .addStringOption(option => option
        .setName('language')
        .setDescription('Language')
        .setRequired(true)
        .addChoices({ name: 'English', value: 'en-US' }, { name: 'Thai (ไทย)', value: 'th-TH' }))),
    category: 'settings',
    permissions: [
        discord_js_1.PermissionsBitField.StageModerator,
        discord_js_1.PermissionsBitField.Flags.Administrator,
    ],
    echo: {
        data: [
            'setlanguage',
        ],
    },
    onlyGuild: true,
    execute({ interaction }) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const _choice = interaction.options.getString('language');
            const guildId = String((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id);
            const _cache = new IngCore.Cache('languages');
            const _old_language = (0, lang_1.getLanguage)(yield _cache.output(guildId));
            const _language = (0, lang_1.getLanguage)(_choice);
            if (!_language) {
                if (!_old_language) {
                    return {
                        content: `Language **${_choice}** is not found!`,
                    };
                }
                else {
                    return {
                        content: _old_language.data.command['language']['fail'],
                    };
                }
            }
            else {
                if (_language.name !== lang_1.ILanguage.DefaultLanguage) {
                    _cache.input(String(_language.name), guildId);
                }
                else {
                    _cache.clear(guildId);
                }
                return {
                    content: _language.data.command['language']['succes'],
                };
            }
        });
    },
};
exports.default = __command;
