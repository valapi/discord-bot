"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const ValAccount_1 = tslib_1.__importDefault(require("../../../utils/ValAccount"));
const lib_1 = require("@valapi/lib");
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName('party')
        .setDescription('Valorant InGame Party'),
    type: 'valorant',
    onlyGuild: true,
    execute({ interaction, language, apiKey, createdTime }) {
        var _a, _b, _c;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const userId = interaction.user.id;
            const { ValClient, ValApiCom, __isFind } = yield (0, ValAccount_1.default)({
                userId: userId,
                apiKey: apiKey,
                language: language,
                region: "ap",
            });
            if (__isFind === false) {
                yield interaction.editReply({
                    content: language.data.command['account']['not_account'],
                });
                return;
            }
            ValClient.on('error', ((data) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                yield interaction.editReply({
                    content: `${language.data.error} ${discord_js_1.Formatters.codeBlock('json', JSON.stringify({ errorCode: data.errorCode, message: data.message }))}`,
                });
            })));
            const ValorantUserInfo = yield ValClient.Player.GetUserInfo();
            const puuid = ValorantUserInfo.data.sub;
            let Party_ID = (yield ValClient.Party.FetchPlayer(puuid)).data.CurrentPartyID;
            const TheParty = yield ValClient.Party.FetchParty(Party_ID);
            let sendMessageArray = [];
            let currentArrayPosition = 0;
            if (TheParty.data.message === 'Party does not exist' || TheParty.data.errorCode === 'PARTY_DNE') {
                yield interaction.editReply({
                    content: language.data.command['party']['not_party'],
                });
                return;
            }
            let Party_QueueID = lib_1.QueueId.toString(TheParty.data.MatchmakingData.QueueID);
            let Party_RemoveRR = TheParty.data.MatchmakingData.SkillDisparityRRPenalty;
            let Party_Accessibility = TheParty.data.Accessibility;
            sendMessageArray.push(new discord_js_1.MessageEmbed()
                .setColor(`#0099ff`)
                .setTitle(`Party`)
                .addFields({ name: 'Queue Mode', value: Party_QueueID, inline: true }, { name: 'Accessibility', value: Party_Accessibility, inline: true }));
            if (Party_RemoveRR) {
                (_a = sendMessageArray.at(currentArrayPosition)) === null || _a === void 0 ? void 0 : _a.addFields({ name: '\u200B', value: '\u200B' }, {
                    name: 'Disparity Rank Rating Penalty',
                    value: `${Party_RemoveRR}%`,
                    inline: true,
                });
            }
            currentArrayPosition += 1;
            const AllMembers = TheParty.data.Members;
            sendMessageArray.push(new discord_js_1.MessageEmbed()
                .setColor(`#0099ff`)
                .setTitle(`Members`));
            for (let member of AllMembers) {
                const ThatPlayer = yield ValClient.Player.GetUsername(member.PlayerIdentity.Subject);
                const ThatPlayerArg = ThatPlayer.data.find(player => player.Subject = member.Subject);
                let sendMessage = `Level: **${member.PlayerIdentity.AccountLevel}**\nWin: **${member.SeasonalBadgeInfo.NumberOfWins}**`;
                if (member.IsOwner) {
                    sendMessage = `*Owner*\n${sendMessage}`;
                }
                else if (member.IsModerator) {
                    sendMessage = `*Moderator*\n${sendMessage}`;
                }
                (_b = sendMessageArray.at(currentArrayPosition)) === null || _b === void 0 ? void 0 : _b.addField(`${ThatPlayerArg === null || ThatPlayerArg === void 0 ? void 0 : ThatPlayerArg.GameName}#${ThatPlayerArg === null || ThatPlayerArg === void 0 ? void 0 : ThatPlayerArg.TagLine}`, `${sendMessage}`, true);
            }
            if (AllMembers.length > 1) {
                (_c = sendMessageArray.at(currentArrayPosition)) === null || _c === void 0 ? void 0 : _c.setColor('#00ff00');
            }
            currentArrayPosition += 1;
            yield interaction.editReply({
                embeds: sendMessageArray,
            });
        });
    }
};
