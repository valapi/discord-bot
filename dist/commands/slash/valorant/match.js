"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const ValAccount_1 = tslib_1.__importDefault(require("../../../utils/ValAccount"));
const lib_1 = require("@valapi/lib");
const core_1 = require("@ing3kth/core");
exports.default = {
    data: new builders_1.SlashCommandBuilder()
        .setName('match')
        .setDescription('Valorant InGame Match')
        .addNumberOption(option => option
        .setName('index')
        .setDescription('Match Index')),
    type: 'valorant',
    onlyGuild: true,
    execute({ interaction, language, apiKey, createdTime }) {
        var _a, _b, _c, _d, _e;
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
            const PlayerMatchHistory = yield ValClient.Match.FetchMatchHistory(puuid);
            const _MatchHistory = PlayerMatchHistory.data.History[(interaction.options.getNumber('index') || 1) - 1];
            if (!_MatchHistory) {
                yield interaction.editReply({
                    content: 'Match not found',
                });
                return;
            }
            let sendMessageArray = [];
            let Match_ID = _MatchHistory.MatchID;
            const AllMatchData = yield ValClient.Match.FetchMatchDetails(Match_ID);
            if (AllMatchData.data.matchInfo.isCompleted === false) {
                yield interaction.editReply({
                    content: 'Match not completed',
                });
                return;
            }
            let Match_Type = AllMatchData.data.matchInfo.queueID;
            let Match_Name = String(lib_1.QueueId.fromString(Match_Type)).replace('_', ' ');
            let Match_isRankGame = AllMatchData.data.matchInfo.isRanked;
            let Match_StartTimeStamp = new Date(AllMatchData.data.matchInfo.gameStartMillis);
            let Match_LongInMillisecondFormat = (0, core_1.Milliseconds)(AllMatchData.data.matchInfo.gameLengthMillis);
            const _time = `**${Match_LongInMillisecondFormat.data.hour}** hour(s)\n**${Match_LongInMillisecondFormat.data.minute}** minute(s)\n**${Match_LongInMillisecondFormat.data.second}** second(s)`;
            const GetMap = yield ValApiCom.Maps.get();
            if (GetMap.isError || !GetMap.data.data)
                throw new Error(GetMap.data.error);
            const ThisMap = GetMap.data.data.find(map => map.mapUrl === AllMatchData.data.matchInfo.mapId);
            let Match_Display = ThisMap === null || ThisMap === void 0 ? void 0 : ThisMap.listViewIcon;
            const GetSeason = yield ValApiCom.Seasons.getByUuid(AllMatchData.data.matchInfo.seasonId);
            if (GetSeason.isError || !GetSeason.data.data)
                throw new Error(GetSeason.data.error);
            let Match_Season = GetSeason.data.data.displayName;
            sendMessageArray.push(new discord_js_1.MessageEmbed()
                .setColor(`#0099ff`)
                .setTitle('Match Info')
                .addFields({ name: 'Queue Mode', value: Match_Name, inline: true }, { name: 'ACT Rank', value: Match_Season, inline: true }, { name: '\u200B', value: '\u200B' }, { name: 'Duration', value: _time, inline: true }, { name: 'Start At', value: Match_StartTimeStamp.toUTCString(), inline: true })
                .setImage(Match_Display));
            const AllPlayers = AllMatchData.data.players;
            const ThisPlayer = AllPlayers.find(player => player.subject === puuid);
            let Player_Kills = ThisPlayer === null || ThisPlayer === void 0 ? void 0 : ThisPlayer.stats.kills;
            let Player_Deaths = ThisPlayer === null || ThisPlayer === void 0 ? void 0 : ThisPlayer.stats.deaths;
            let Player_Assists = ThisPlayer === null || ThisPlayer === void 0 ? void 0 : ThisPlayer.stats.assists;
            let Player_Level = ThisPlayer === null || ThisPlayer === void 0 ? void 0 : ThisPlayer.accountLevel;
            let Player_Team = ThisPlayer === null || ThisPlayer === void 0 ? void 0 : ThisPlayer.teamId;
            let Player_Rank = ``;
            const AllRanks = yield ValApiCom.CompetitiveTiers.get();
            if (AllRanks.isError || !AllRanks.data.data)
                throw new Error(AllRanks.data.error);
            for (let _rank of AllRanks.data.data) {
                for (let _tier of _rank.tiers) {
                    if (_tier.tier == (ThisPlayer === null || ThisPlayer === void 0 ? void 0 : ThisPlayer.competitiveTier)) {
                        Player_Rank = _tier.tierName;
                        break;
                    }
                }
                if (Player_Rank) {
                    break;
                }
            }
            const GetAgent = yield ValApiCom.Agents.getByUuid(ThisPlayer === null || ThisPlayer === void 0 ? void 0 : ThisPlayer.characterId);
            if (GetAgent.isError || !GetAgent.data.data)
                throw new Error(GetAgent.data.error);
            let Player_Agent_Name = GetAgent.data.data.displayName;
            let Player_Agent_Display = GetAgent.data.data.displayIcon;
            let Player_Agent_Color = String(GetAgent.data.data.backgroundGradientColors[2]).substring(0, GetAgent.data.data.backgroundGradientColors[2].length - 2);
            sendMessageArray.push(new discord_js_1.MessageEmbed()
                .setColor(`#${Player_Agent_Color}`)
                .setTitle('Player Info')
                .addFields({ name: 'Kills', value: `${Player_Kills}`, inline: true }, { name: 'Deaths', value: `${Player_Deaths}`, inline: true }, { name: 'Assists', value: `${Player_Assists}`, inline: true }, { name: '\u200B', value: '\u200B' }, { name: 'Level', value: `${Player_Level}`, inline: true })
                .setThumbnail(Player_Agent_Display));
            if (Match_Type === 'competitive') {
                (_a = sendMessageArray.at(1)) === null || _a === void 0 ? void 0 : _a.addField('Rank', Player_Rank, true);
            }
            (_b = sendMessageArray.at(1)) === null || _b === void 0 ? void 0 : _b.addFields({ name: '\u200B', value: '\u200B' }, { name: 'Agent', value: Player_Agent_Name, inline: true });
            if (Match_Type !== 'deathmatch') {
                (_c = sendMessageArray.at(1)) === null || _c === void 0 ? void 0 : _c.addField('Team', Player_Team, true);
            }
            if (AllMatchData.data.teams.length > 1 && Match_Type !== 'deathmatch') {
                const AllTeams = AllMatchData.data.teams;
                sendMessageArray.push(new discord_js_1.MessageEmbed()
                    .setColor(`#0099ff`)
                    .setTitle('Teams'));
                for (let _team of AllTeams) {
                    let Teams_Name = _team.teamId;
                    let Teams_Score = _team.numPoints;
                    let Teams_Won = _team.roundsWon;
                    (_d = sendMessageArray.at(2)) === null || _d === void 0 ? void 0 : _d.addFields({
                        name: `${Teams_Name}`,
                        value: `Score: **${Teams_Score}**\nWon (rounds)*:* **${Teams_Won}**`,
                        inline: true
                    });
                }
                let Team_isWin = (_e = (AllTeams.find(team => team.teamId === Player_Team))) === null || _e === void 0 ? void 0 : _e.won;
                if (Team_isWin === true) {
                    sendMessageArray.forEach(embed => embed.setColor('#00ff00'));
                }
                else if (Team_isWin === false) {
                    sendMessageArray.forEach(embed => embed.setColor('#ff0000'));
                }
            }
            yield interaction.editReply({
                embeds: sendMessageArray,
            });
        });
    }
};
