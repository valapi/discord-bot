"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const IngCore = tslib_1.__importStar(require("@ing3kth/core"));
const controller_1 = require("../../../language/controller");
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName('language')
        .setDescription('Change Language')
        .addStringOption(option => option
        .setName('language')
        .setDescription('Language')
        .setRequired(true)
        .addChoices({ name: 'English', value: 'en_US' }, { name: 'Thai', value: 'th_TH' })),
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
                if (_language.name !== controller_1.defaultLanguage) {
                    yield _cache.input(String(_language.name), guildId);
                }
                else {
                    yield _cache.clear(guildId);
                }
                yield interaction.editReply(_language.data.command['language']['succes']);
            }
        });
    },
};
