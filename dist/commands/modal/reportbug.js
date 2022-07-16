"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const IngCore = tslib_1.__importStar(require("@ing3kth/core"));
const controller_1 = require("../../language/controller");
exports.default = {
    customId: 'reportbug',
    execute(modal, { client }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const _language = (0, controller_1.getLanguageAndUndefined)(yield IngCore.Cache.output({ name: 'language', interactionId: String(modal.guildId) }));
            const _Topic = modal.getTextInputValue('reportbug-text1');
            const _Message = modal.getTextInputValue('reportbug-text2');
            const OwnerOfClient = yield client.users.fetch('549231132382855189');
            yield OwnerOfClient.send({
                content: `${discord_js_1.Formatters.userMention(modal.user.id)} has reported a bug!\n\nTopic:\n**${_Topic}**\n\nMessage:\n${discord_js_1.Formatters.blockQuote(_Message)}`,
            });
            const createButtons = new discord_js_1.MessageActionRow()
                .addComponents(new discord_js_1.MessageButton()
                .setCustomId('reportagain')
                .setLabel('Show Report Form')
                .setStyle('SECONDARY'));
            yield modal.reply({
                content: `${_language.data.command['report']['thanks']}`,
                components: [createButtons],
                ephemeral: true
            });
        });
    }
};
