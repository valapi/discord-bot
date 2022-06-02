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
//common
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
//valorant common
const crypto_1 = require("../../../utils/crypto");
const database_1 = require("../../../utils/database");
//valorant
const api_wrapper_1 = require("@valapi/api-wrapper");
const valorant_api_com_1 = require("@valapi/valorant-api.com");
const lib_1 = require("@valapi/lib");
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName('party')
        .setDescription('Valorant InGame Party'),
    type: 'valorant',
    execute({ interaction, language, apiKey, createdTime }) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            //script
            const userId = interaction.user.id;
            const ValDatabase = (yield database_1.ValData.verify()).getCollection();
            const ValAccountInDatabase = yield database_1.ValData.checkIfExist(ValDatabase, { discordId: userId });
            //valorant
            const ValApiCom = new valorant_api_com_1.Client({
                language: (language.name).replace('_', '-'),
            });
            const ValClient = new api_wrapper_1.Client({
                region: "ap",
                autoReconnect: true,
            });
            ValClient.on('error', ((data) => __awaiter(this, void 0, void 0, function* () {
                yield interaction.editReply({
                    content: `${language.data.error} ${discord_js_1.Formatters.codeBlock('json', JSON.stringify({ errorCode: data.errorCode, message: data.message }))}`,
                });
            })));
            //get
            if (!ValAccountInDatabase.isFind) {
                yield interaction.editReply({
                    content: language.data.command['account']['not_account'],
                });
                return;
            }
            const SaveAccount = ValAccountInDatabase.once.account;
            ValClient.fromJSONAuth(JSON.parse((0, crypto_1.decrypt)(SaveAccount, apiKey)));
            //success
            const ValorantUserInfo = yield ValClient.Player.GetUserInfo();
            const puuid = ValorantUserInfo.data.sub;
            let Party_ID = (yield ValClient.Party.FetchPlayer(puuid)).data.CurrentPartyID;
            const TheParty = yield ValClient.Party.FetchParty(Party_ID);
            let sendMessageArray = [];
            let currentArrayPosition = 0;
            // PARTY //
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
            // MEMBER //
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
            // DONE //
            yield interaction.editReply({
                embeds: sendMessageArray,
            });
        });
    }
};
//# sourceMappingURL=party.js.map