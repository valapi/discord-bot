"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const IngCore = tslib_1.__importStar(require("@ing3kth/core"));
const discord_js_1 = require("discord.js");
const accounts_1 = require("../../../utils/accounts");
const lib_1 = require("@valapi/lib");
const __command = {
    command: (new discord_js_1.SlashCommandBuilder()
        .setName('match')
        .setDescription('Match history')
        .addNumberOption(option => option
        .setName('index')
        .setDescription('Match Index'))
        .addStringOption(option => option
        .setName('queue')
        .setDescription('Queue Mode')
        .addChoices({ name: lib_1.QueueId.from.competitive, value: lib_1.QueueId.to.Competitive }, { name: lib_1.QueueId.from.deathmatch, value: lib_1.QueueId.to.Deathmatch }, { name: lib_1.QueueId.from.ggteam, value: lib_1.QueueId.to.Escalation }, { name: lib_1.QueueId.from.onefa, value: lib_1.QueueId.to.Replication }, { name: lib_1.QueueId.from.spikerush, value: lib_1.QueueId.to.Spikerush }, { name: lib_1.QueueId.from.unrated, value: lib_1.QueueId.to.Unrated }))),
    category: 'valorant',
    echo: {
        data: [
            'matchhistory'
        ],
    },
    onlyGuild: true,
    execute({ interaction, language, apiKey, createdTime }) {
        var _a, _b, _c, _d, _e;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const userId = interaction.user.id;
            const { WebClient, ValorantApiCom, isValorAccountFind } = yield (0, accounts_1.ValorAccount)({
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
            const PlayerMatchHistory = yield WebClient.Match.FetchMatchHistory(puuid, interaction.options.getString('queue'));
            const _MatchHistory = PlayerMatchHistory.data.History[(interaction.options.getNumber('index') || 1) - 1];
            if (!_MatchHistory) {
                return {
                    content: language.data.command['match']['not_match'],
                };
            }
            const sendMessageArray = [];
            const Match_ID = _MatchHistory.MatchID;
            const AllMatchData = yield WebClient.Match.FetchMatchDetails(Match_ID);
            if (AllMatchData.data.matchInfo.isCompleted === false) {
                return {
                    content: 'Match not completed',
                };
            }
            const Match_Type = AllMatchData.data.matchInfo.queueID;
            const Match_Name = String(lib_1.QueueId.fromString(Match_Type)).replace('_', ' ');
            const Match_isRankGame = AllMatchData.data.matchInfo.isRanked;
            const Match_StartTimeStamp = new Date(AllMatchData.data.matchInfo.gameStartMillis);
            const Match_LongInMillisecondFormat = IngCore.ToMilliseconds(AllMatchData.data.matchInfo.gameLengthMillis);
            const _time = `**${Match_LongInMillisecondFormat.data.hour}** hour(s)\n**${Match_LongInMillisecondFormat.data.minute}** minute(s)\n**${Match_LongInMillisecondFormat.data.second}** second(s)`;
            const GetMap = yield ValorantApiCom.Maps.get();
            if (GetMap.isError || !GetMap.data.data)
                throw new Error(GetMap.data.error);
            const ThisMap = GetMap.data.data.find(map => map.mapUrl === AllMatchData.data.matchInfo.mapId);
            const Match_Display = ThisMap === null || ThisMap === void 0 ? void 0 : ThisMap.listViewIcon;
            const GetSeason = yield ValorantApiCom.Seasons.getByUuid(AllMatchData.data.matchInfo.seasonId);
            if (GetSeason.isError || !GetSeason.data.data)
                throw new Error(GetSeason.data.error);
            const Match_Season = GetSeason.data.data.displayName;
            sendMessageArray.push(new discord_js_1.EmbedBuilder()
                .setColor(`#0099ff`)
                .setTitle('Match Info')
                .addFields({ name: 'Queue Mode', value: `${Match_Name}`, inline: true }, { name: 'ACT Rank', value: `${Match_Season}`, inline: true }, { name: '\u200B', value: '\u200B' }, { name: 'Duration', value: `${_time}`, inline: true }, { name: 'Start At', value: (0, discord_js_1.time)(Match_StartTimeStamp), inline: true })
                .setImage(Match_Display));
            const AllPlayers = AllMatchData.data.players;
            const ThisPlayer = AllPlayers.find(player => player.subject === puuid);
            const Player_Kills = ThisPlayer === null || ThisPlayer === void 0 ? void 0 : ThisPlayer.stats.kills;
            const Player_Deaths = ThisPlayer === null || ThisPlayer === void 0 ? void 0 : ThisPlayer.stats.deaths;
            const Player_Assists = ThisPlayer === null || ThisPlayer === void 0 ? void 0 : ThisPlayer.stats.assists;
            const Player_Level = ThisPlayer === null || ThisPlayer === void 0 ? void 0 : ThisPlayer.accountLevel;
            const Player_Team = ThisPlayer === null || ThisPlayer === void 0 ? void 0 : ThisPlayer.teamId;
            let Player_Rank = ``;
            const AllRanks = yield ValorantApiCom.CompetitiveTiers.get();
            if (AllRanks.isError || !AllRanks.data.data)
                throw new Error(AllRanks.data.error);
            for (const _rank of AllRanks.data.data) {
                for (const _tier of _rank.tiers) {
                    if (_tier.tier == (ThisPlayer === null || ThisPlayer === void 0 ? void 0 : ThisPlayer.competitiveTier)) {
                        Player_Rank = _tier.tierName;
                        break;
                    }
                }
                if (Player_Rank) {
                    break;
                }
            }
            const GetAgent = yield ValorantApiCom.Agents.getByUuid(ThisPlayer === null || ThisPlayer === void 0 ? void 0 : ThisPlayer.characterId);
            if (GetAgent.isError || !GetAgent.data.data)
                throw new Error(GetAgent.data.error);
            const Player_Agent_Name = GetAgent.data.data.displayName;
            const Player_Agent_Display = GetAgent.data.data.displayIcon;
            const Player_Agent_Color = String(GetAgent.data.data.backgroundGradientColors[2]).substring(0, GetAgent.data.data.backgroundGradientColors[2].length - 2);
            sendMessageArray.push(new discord_js_1.EmbedBuilder()
                .setColor(`#${Player_Agent_Color}`)
                .setTitle('Player Info')
                .addFields({ name: 'Kills', value: `${Player_Kills}`, inline: true }, { name: 'Deaths', value: `${Player_Deaths}`, inline: true }, { name: 'Assists', value: `${Player_Assists}`, inline: true }, { name: '\u200B', value: '\u200B' }, { name: 'Level', value: `${Player_Level}`, inline: true })
                .setThumbnail(Player_Agent_Display));
            if (Match_Type === 'competitive') {
                (_a = sendMessageArray.at(1)) === null || _a === void 0 ? void 0 : _a.addFields({ name: 'Rank', value: `${Player_Rank}`, inline: true });
            }
            (_b = sendMessageArray.at(1)) === null || _b === void 0 ? void 0 : _b.addFields({ name: '\u200B', value: '\u200B' }, { name: 'Agent', value: `${Player_Agent_Name}`, inline: true });
            if (Match_Type !== 'deathmatch') {
                (_c = sendMessageArray.at(1)) === null || _c === void 0 ? void 0 : _c.addFields({ name: 'Team', value: `${Player_Team}`, inline: true });
            }
            if (AllMatchData.data.teams.length > 1 && Match_Type !== 'deathmatch') {
                const AllTeams = AllMatchData.data.teams;
                sendMessageArray.push(new discord_js_1.EmbedBuilder()
                    .setColor(`#0099ff`)
                    .setTitle('Teams'));
                for (const _team of AllTeams) {
                    const Teams_Name = _team.teamId;
                    const Teams_Score = _team.numPoints;
                    const Teams_Won = _team.roundsWon;
                    (_d = sendMessageArray.at(2)) === null || _d === void 0 ? void 0 : _d.addFields({
                        name: `${Teams_Name}`,
                        value: `Score: **${Teams_Score}**\nWon (rounds)*:* **${Teams_Won}**`,
                        inline: true
                    });
                }
                const Team_isWin = (_e = (AllTeams.find(team => team.teamId === Player_Team))) === null || _e === void 0 ? void 0 : _e.won;
                if (Team_isWin === true) {
                    sendMessageArray.forEach(embed => embed.setColor('#00ff00'));
                }
                else if (Team_isWin === false) {
                    sendMessageArray.forEach(embed => embed.setColor('#ff0000'));
                }
            }
            return {
                embeds: sendMessageArray,
            };
        });
    },
};
exports.default = __command;
