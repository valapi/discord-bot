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
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName('rank')
        .setDescription('Valorant Competitive Rank'),
    type: 'valorant',
    execute({ interaction, language, apiKey, createdTime }) {
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
            const ThisRank = ((yield ValClient.MMR.FetchCompetitiveUpdates(puuid)).data.Matches.filter(match => Number(match.RankedRatingEarned) !== 0)).at(0);
            let Rank_Rating_Earned = ThisRank.RankedRatingEarned;
            let Rank_Rating_Now = ThisRank.RankedRatingAfterUpdate;
            let Rank_Rating_Old = ThisRank.RankedRatingBeforeUpdate;
            const AllRanks = yield ValApiCom.CompetitiveTiers.get();
            if (AllRanks.isError || !AllRanks.data.data)
                throw new Error(AllRanks.data.error);
            let Rank_Name = '';
            let Rank_Icon = '';
            let Rank_Color = '';
            for (let _rank of AllRanks.data.data) {
                for (let _tier of _rank.tiers) {
                    if (_tier.tier == ThisRank.TierAfterUpdate) {
                        Rank_Name = _tier.tierName;
                        Rank_Icon = _tier.largeIcon;
                        Rank_Color = String(_tier.backgroundColor).substring(0, _tier.backgroundColor.length - 2);
                        break;
                    }
                }
                if (Rank_Name) {
                    break;
                }
            }
            interaction.editReply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setColor(`#${Rank_Color}`)
                        .setTimestamp(createdTime)
                        .addFields({
                        name: "Rank",
                        value: `${Rank_Name}`,
                    }, { name: '\u200B', value: '\u200B' }, {
                        name: "Rating",
                        value: `${Rank_Rating_Now} RR\n(*${discord_js_1.Formatters.strikethrough(Rank_Rating_Old)}* / ${Rank_Rating_Earned})`,
                    })
                        .setThumbnail(Rank_Icon),
                ]
            });
        });
    }
};
//# sourceMappingURL=rank.js.map