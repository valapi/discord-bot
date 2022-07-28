"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const accounts_1 = require("../../../utils/accounts");
const lib_1 = require("@valapi/lib");
const __command = {
    command: (new discord_js_1.SlashCommandBuilder()
        .setName('party')
        .setDescription('Party')),
    category: 'valorant',
    onlyGuild: true,
    inDevlopment: true,
    execute({ interaction, language, apiKey, createdTime }) {
        var _a, _b, _c;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const userId = interaction.user.id;
            const { WebClient, isValorAccountFind } = yield (0, accounts_1.ValorAccount)({
                userId,
                apiKey,
                language: language.name,
            });
            if (isValorAccountFind === false) {
                return {
                    content: language.data.command['account']['not_account'],
                };
            }
            const puuid = WebClient.getSubject();
            const Party_ID = (yield WebClient.Party.FetchPlayer(puuid)).data.CurrentPartyID;
            const TheParty = yield WebClient.Party.FetchParty(Party_ID);
            const sendMessageArray = [];
            if (TheParty.data.message === 'Party does not exist' || TheParty.data.errorCode === 'PARTY_DNE') {
                return {
                    content: language.data.command['party']['not_party'],
                };
            }
            const Party_QueueID = lib_1.QueueId.fromString(TheParty.data.MatchmakingData.QueueID);
            const Party_RemoveRR = TheParty.data.MatchmakingData.SkillDisparityRRPenalty;
            const Party_Accessibility = TheParty.data.Accessibility;
            sendMessageArray.push(new discord_js_1.EmbedBuilder()
                .setColor(`#0099ff`)
                .setTitle(`Party`)
                .addFields({ name: 'Queue Mode', value: `${Party_QueueID}`, inline: true }, { name: 'Accessibility', value: `${Party_Accessibility}`, inline: true }));
            if (Party_RemoveRR) {
                (_a = sendMessageArray.at(0)) === null || _a === void 0 ? void 0 : _a.addFields({ name: '\u200B', value: '\u200B' }, {
                    name: 'Disparity Rank Rating Penalty',
                    value: `${Party_RemoveRR}%`,
                    inline: true,
                });
            }
            const AllMembers = TheParty.data.Members;
            sendMessageArray.push(new discord_js_1.EmbedBuilder()
                .setColor(`#0099ff`)
                .setTitle(`Members`));
            for (const member of AllMembers) {
                const ThatPlayer = yield WebClient.Player.GetUsername(member.PlayerIdentity.Subject);
                const ThatPlayerArg = ThatPlayer.data.find(player => player.Subject = member.Subject);
                let sendMessage = `Level: **${member.PlayerIdentity.AccountLevel}**`;
                if (member.IsOwner === true) {
                    sendMessage = `*Owner*\n${sendMessage}`;
                }
                else if (member.IsModerator === true) {
                    sendMessage = `*Moderator*\n${sendMessage}`;
                }
                (_b = sendMessageArray.at(1)) === null || _b === void 0 ? void 0 : _b.addFields({
                    name: `${ThatPlayerArg === null || ThatPlayerArg === void 0 ? void 0 : ThatPlayerArg.GameName}#${ThatPlayerArg === null || ThatPlayerArg === void 0 ? void 0 : ThatPlayerArg.TagLine}`,
                    value: `${sendMessage}`,
                    inline: true,
                });
            }
            if (AllMembers.length > 1) {
                (_c = sendMessageArray.at(1)) === null || _c === void 0 ? void 0 : _c.setColor('#00ff00');
            }
            return {
                embeds: sendMessageArray,
            };
        });
    }
};
exports.default = __command;
