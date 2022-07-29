"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const accounts_1 = require("../../../utils/accounts");
const __command = {
    command: (new discord_js_1.SlashCommandBuilder()
        .setName('rank')
        .setDescription('Competitive Rank')),
    category: 'valorant',
    onlyGuild: true,
    async execute({ interaction, language, apiKey, createdTime }) {
        const userId = interaction.user.id;
        const { WebClient, ValorantApiCom, isValorAccountFind } = await (0, accounts_1.ValorAccount)({
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
        const ThisRank = ((await WebClient.MMR.FetchCompetitiveUpdates(puuid)).data.Matches.filter(match => Number(match.RankedRatingEarned) !== 0)).at(0);
        const Rank_Rating_Now = ThisRank.RankedRatingAfterUpdate;
        const AllRanks = await ValorantApiCom.CompetitiveTiers.get();
        if (AllRanks.isError || !AllRanks.data.data)
            throw new Error(AllRanks.data.error);
        let Rank_Name = '';
        let Rank_Icon = '';
        let Rank_Color = '';
        for (const _rank of AllRanks.data.data) {
            for (const _tier of _rank.tiers) {
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
        return {
            embeds: [
                new discord_js_1.EmbedBuilder()
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
            ],
        };
    },
};
exports.default = __command;
