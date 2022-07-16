"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const ValAccount_1 = tslib_1.__importDefault(require("../../../utils/ValAccount"));
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName('rank')
        .setDescription('Valorant Competitive Rank'),
    type: 'valorant',
    onlyGuild: true,
    execute({ interaction, language, apiKey, createdTime }) {
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
            const ThisRank = ((yield ValClient.MMR.FetchCompetitiveUpdates(puuid)).data.Matches.filter(match => Number(match.RankedRatingEarned) !== 0)).at(0);
            let Rank_Rating_Now = ThisRank.RankedRatingAfterUpdate;
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
                        value: `${Rank_Rating_Now} RR`,
                    })
                        .setThumbnail(Rank_Icon),
                ]
            });
        });
    }
};
