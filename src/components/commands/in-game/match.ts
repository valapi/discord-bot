//import

import * as IngCore from '@ing3kth/core';
import { SlashCommandBuilder, EmbedBuilder, time } from 'discord.js';
import type { ICommandHandler } from "../../../modules";

import { Region } from 'valorant.ts';
import { ValorAccount } from '../../../utils/accounts';

import { QueueId } from '@valapi/lib';

//script

const __command: ICommandHandler.File = {
    command: (
        new SlashCommandBuilder()
            .setName('match')
            .setDescription('Match history')
            .addNumberOption(option =>
                option
                    .setName('index')
                    .setDescription('Match Index')
            )
            .addStringOption(option =>
                option
                    .setName('queue')
                    .setDescription('Queue Mode')
                    .addChoices(
                        { name: QueueId.from.competitive, value: QueueId.to.Competitive },
                        { name: QueueId.from.deathmatch, value: QueueId.to.Deathmatch },
                        { name: QueueId.from.ggteam, value: QueueId.to.Escalation },
                        { name: QueueId.from.onefa, value: QueueId.to.Replication },
                        //{ name: QueueId.from.snowball, value: QueueId.to.Snowball_Fight },
                        { name: QueueId.from.spikerush, value: QueueId.to.Spikerush },
                        //{ name: QueueId.from.tournamentmode, value: QueueId.to.Custom_Tournament },
                        { name: QueueId.from.unrated, value: QueueId.to.Unrated },
                    )
            )
    ),
    category: 'valorant',
    echo: {
        data: [
            'matchhistory'
        ],
    },
    onlyGuild: true,
    async execute({ interaction, language, apiKey, createdTime }) {
        //load

        const userId = interaction.user.id;

        const { WebClient, ValorantApiCom, isValorAccountFind } = await ValorAccount({
            userId,
            apiKey,
            language: language.name,
            region: Region.Asia_Pacific,
        });

        if (isValorAccountFind === false) {
            return {
                content: language.data.command['account']['not_account'],
            };
        }

        //script

        const puuid = WebClient.getSubject();

        const PlayerMatchHistory = await WebClient.Match.FetchMatchHistory(puuid, (interaction.options.getString('queue') as keyof typeof QueueId.from));
        const _MatchHistory = PlayerMatchHistory.data.History[(interaction.options.getNumber('index') || 1) - 1];

        if (!_MatchHistory) {
            return {
                content: language.data.command['match']['not_match'],
            };
        }

        let sendMessageArray: Array<EmbedBuilder> = [];

        //script
        let Match_ID = _MatchHistory.MatchID;

        const AllMatchData = await WebClient.Match.FetchMatchDetails(Match_ID);

        if (AllMatchData.data.matchInfo.isCompleted === false) {
            return {
                content: 'Match not completed',
            };
        }

        // MATCH //

        let Match_Type = AllMatchData.data.matchInfo.queueID as keyof typeof QueueId.from;
        let Match_Name = String(QueueId.fromString(Match_Type)).replace('_', ' ');
        let Match_isRankGame = AllMatchData.data.matchInfo.isRanked;

        //time
        let Match_StartTimeStamp = new Date(AllMatchData.data.matchInfo.gameStartMillis);

        let Match_LongInMillisecondFormat = IngCore.ToMilliseconds(AllMatchData.data.matchInfo.gameLengthMillis);
        const _time = `**${Match_LongInMillisecondFormat.data.hour}** hour(s)\n**${Match_LongInMillisecondFormat.data.minute}** minute(s)\n**${Match_LongInMillisecondFormat.data.second}** second(s)`;

        //map
        const GetMap = await ValorantApiCom.Maps.get();
        if (GetMap.isError || !GetMap.data.data) throw new Error(GetMap.data.error);

        const ThisMap = GetMap.data.data.find(map => map.mapUrl === AllMatchData.data.matchInfo.mapId);

        let Match_Display: string = ThisMap?.listViewIcon as string;

        //season
        const GetSeason = await ValorantApiCom.Seasons.getByUuid(AllMatchData.data.matchInfo.seasonId);
        if (GetSeason.isError || !GetSeason.data.data) throw new Error(GetSeason.data.error);

        let Match_Season = GetSeason.data.data.displayName as string;

        sendMessageArray.push(
            new EmbedBuilder()
                .setColor(`#0099ff`)
                .setTitle('Match Info')
                .addFields(
                    { name: 'Queue Mode', value: `${Match_Name}`, inline: true },
                    { name: 'ACT Rank', value: `${Match_Season}`, inline: true },
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Duration', value: `${_time}`, inline: true },
                    { name: 'Start At', value: time(Match_StartTimeStamp), inline: true },
                )
                .setImage(Match_Display)
        )

        // PLAYERS //

        const AllPlayers: Array<{
            // this is not all of interface
            // i mean not done! (i just need only important data)
            subject: string;
            stats: {
                kills: number;
                deaths: number;
                assists: number;
            };
            gameName: string;
            tagLine: string;
            teamId: string;
            characterId: string;
            competitiveTier: number;
            accountLevel: number;
        }> = AllMatchData.data.players;
        const ThisPlayer = AllPlayers.find(player => player.subject === puuid);

        let Player_Kills: number = ThisPlayer?.stats.kills as number;
        let Player_Deaths: number = ThisPlayer?.stats.deaths as number;
        let Player_Assists: number = ThisPlayer?.stats.assists as number;
        let Player_Level: number = ThisPlayer?.accountLevel as number;
        let Player_Team: string = ThisPlayer?.teamId as string;

        //rank
        let Player_Rank: string = ``;

        const AllRanks = await ValorantApiCom.CompetitiveTiers.get();
        if (AllRanks.isError || !AllRanks.data.data) throw new Error(AllRanks.data.error);

        for (let _rank of AllRanks.data.data) {
            for (let _tier of _rank.tiers) {
                if (_tier.tier == ThisPlayer?.competitiveTier) {
                    Player_Rank = _tier.tierName as string;
                    break;
                }
            }

            if (Player_Rank) {
                break;
            }
        }

        //agent
        const GetAgent = await ValorantApiCom.Agents.getByUuid(ThisPlayer?.characterId as string);
        if (GetAgent.isError || !GetAgent.data.data) throw new Error(GetAgent.data.error);

        let Player_Agent_Name: string = GetAgent.data.data.displayName as string;
        let Player_Agent_Display: string = GetAgent.data.data.displayIcon;
        let Player_Agent_Color: string = String(GetAgent.data.data.backgroundGradientColors[2]).substring(0, GetAgent.data.data.backgroundGradientColors[2].length - 2);

        sendMessageArray.push(
            new EmbedBuilder()
                .setColor(`#${Player_Agent_Color}`)
                .setTitle('Player Info')
                .addFields(
                    { name: 'Kills', value: `${Player_Kills}`, inline: true },
                    { name: 'Deaths', value: `${Player_Deaths}`, inline: true },
                    { name: 'Assists', value: `${Player_Assists}`, inline: true },
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Level', value: `${Player_Level}`, inline: true },
                )
                .setThumbnail(Player_Agent_Display)
        )

        if (Match_Type === 'competitive') {
            sendMessageArray.at(1)?.addFields({ name: 'Rank', value: `${Player_Rank}`, inline: true });
        }

        sendMessageArray.at(1)?.addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Agent', value: `${Player_Agent_Name}`, inline: true },
        );

        if (Match_Type !== 'deathmatch') {
            sendMessageArray.at(1)?.addFields({ name: 'Team', value: `${Player_Team}`, inline: true });
        }

        // TEAM //
        if ((AllMatchData.data.teams as Array<any>).length > 1 && Match_Type !== 'deathmatch') {
            const AllTeams: Array<{
                teamId: string;
                won: boolean;
                roundsPlayed: number;
                roundsWon: number;
                numPoints: number;
            }> = AllMatchData.data.teams;

            sendMessageArray.push(
                new EmbedBuilder()
                    .setColor(`#0099ff`)
                    .setTitle('Teams')
            );

            for (let _team of AllTeams) {
                let Teams_Name: string = _team.teamId as string;
                let Teams_Score: number = _team.numPoints as number;
                let Teams_Won: number = _team.roundsWon as number;

                sendMessageArray.at(2)?.addFields(
                    {
                        name: `${Teams_Name}`,
                        value: `Score: **${Teams_Score}**\nWon (rounds)*:* **${Teams_Won}**`,
                        inline: true
                    },
                );
            }


            let Team_isWin: boolean | undefined = (AllTeams.find(team => team.teamId === Player_Team))?.won;

            if (Team_isWin === true) {
                sendMessageArray.forEach(embed => embed.setColor('#00ff00'));
            } else if (Team_isWin === false) {
                sendMessageArray.forEach(embed => embed.setColor('#ff0000'));
            }
        }

        //return

        return {
            embeds: sendMessageArray,
        };
    },
}

//export

export default __command;