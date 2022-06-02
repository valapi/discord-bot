//common
import { SlashCommandBuilder } from '@discordjs/builders';
import { Permissions, MessageAttachment, MessageEmbed, Formatters, MessageActionRow, MessageButton, MessageSelectMenu } from 'discord.js';
import type { CustomSlashCommands } from '../../../interface/SlashCommand';

//valorant common
import { decrypt } from '../../../utils/crypto';
import { ValData, type IValorantAccount } from '../../../utils/database';

//valorant
import { Client as ApiWrapper } from '@valapi/api-wrapper';
import { Client as ValAPI } from '@valapi/valorant-api.com';
import { Locale, QueueId } from '@valapi/lib';

import { Milliseconds } from '@ing3kth/core';

export default {
    data: new SlashCommandBuilder()
        .setName('match')
        .setDescription('Valorant InGame Match')
        .addNumberOption(option =>
            option
                .setName('index')
                .setDescription('Match Index')
        ),
    type: 'valorant',
    onlyGuild: true,
    async execute({ interaction, language, apiKey, createdTime }) {
        //script
        const userId = interaction.user.id;

        const ValDatabase = (await ValData.verify()).getCollection<IValorantAccount>();
        const ValAccountInDatabase = await ValData.checkIfExist<IValorantAccount>(ValDatabase, { discordId: userId });

        //valorant
        const ValApiCom = new ValAPI({
            language: (language.name).replace('_', '-') as keyof typeof Locale.from,
        });

        const ValClient = new ApiWrapper({
            region: "ap",
            autoReconnect: true,
        });

        ValClient.on('error', (async (data) => {
            await interaction.editReply({
                content: `${language.data.error} ${Formatters.codeBlock('json', JSON.stringify({ errorCode: data.errorCode, message: data.message }))}`,
            });
        }));

        //get
        if (!ValAccountInDatabase.isFind) {
            await interaction.editReply({
                content: language.data.command['account']['not_account'],
            });
            return;
        }

        const SaveAccount = (ValAccountInDatabase.once as IValorantAccount).account;

        ValClient.fromJSONAuth(JSON.parse(decrypt(SaveAccount, apiKey)));

        //success
        const ValorantUserInfo = await ValClient.Player.GetUserInfo();
        const puuid = ValorantUserInfo.data.sub;

        const PlayerMatchHistory = await ValClient.Match.FetchMatchHistory(puuid);
        const _MatchHistory = PlayerMatchHistory.data.History[(interaction.options.getNumber('index') || 1) - 1];

        if (!_MatchHistory) {
            await interaction.editReply({
                content: 'Match not found',
            });
            return;
        }

        let sendMessageArray: Array<MessageEmbed> = [];

        //script
        let Match_ID = _MatchHistory.MatchID;

        const AllMatchData = await ValClient.Match.FetchMatchDetails(Match_ID);

        if (AllMatchData.data.matchInfo.isCompleted === false) {
            await interaction.editReply({
                content: 'Match not completed',
            });
            return;
        }

        // MATCH //

        let Match_Type = AllMatchData.data.matchInfo.queueID as keyof typeof QueueId.from;
        let Match_Name = String(QueueId.fromString(Match_Type)).replace('_', ' ');
        let Match_isRankGame = AllMatchData.data.matchInfo.isRanked;

        //time
        let Match_StartTimeStamp = new Date(AllMatchData.data.matchInfo.gameStartMillis);

        let Match_LongInMillisecondFormat = Milliseconds(AllMatchData.data.matchInfo.gameLengthMillis);
        const _time = `**${Match_LongInMillisecondFormat.data.hour}** hour(s)\n**${Match_LongInMillisecondFormat.data.minute}** minute(s)\n**${Match_LongInMillisecondFormat.data.second}** second(s)`;

        //map
        const GetMap = await ValApiCom.Maps.get();
        if (GetMap.isError || !GetMap.data.data) throw new Error(GetMap.data.error);

        const ThisMap = GetMap.data.data.find(map => map.mapUrl === AllMatchData.data.matchInfo.mapId);

        let Match_Display: string = ThisMap?.listViewIcon as string;

        //season
        const GetSeason = await ValApiCom.Seasons.getByUuid(AllMatchData.data.matchInfo.seasonId);
        if (GetSeason.isError || !GetSeason.data.data) throw new Error(GetSeason.data.error);

        let Match_Season = GetSeason.data.data.displayName;

        sendMessageArray.push(
            new MessageEmbed()
                .setColor(`#0099ff`)
                .setTitle('Match Info')
                .addFields(
                    { name: 'Queue Mode', value: Match_Name, inline: true },
                    { name: 'ACT Rank', value: Match_Season, inline: true },
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Duration', value: _time, inline: true },
                    { name: 'Start At', value: Match_StartTimeStamp.toUTCString(), inline: true },
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

        const AllRanks = await ValApiCom.CompetitiveTiers.get();
        if (AllRanks.isError || !AllRanks.data.data) throw new Error(AllRanks.data.error);

        for (let _rank of AllRanks.data.data) {
            for (let _tier of _rank.tiers) {
                if (_tier.tier == ThisPlayer?.competitiveTier) {
                    Player_Rank = _tier.tierName;
                    break;
                }
            }

            if (Player_Rank) {
                break;
            }
        }

        //agent
        const GetAgent = await ValApiCom.Agents.getByUuid(ThisPlayer?.characterId as string);
        if (GetAgent.isError || !GetAgent.data.data) throw new Error(GetAgent.data.error);

        let Player_Agent_Name: string = GetAgent.data.data.displayName;
        let Player_Agent_Display: string = GetAgent.data.data.displayIcon;
        let Player_Agent_Color: string = String(GetAgent.data.data.backgroundGradientColors[2]).substring(0, GetAgent.data.data.backgroundGradientColors[2].length - 2);

        sendMessageArray.push(
            new MessageEmbed()
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

        if(Match_Type === 'competitive'){
            sendMessageArray.at(1)?.addField('Rank', Player_Rank, true);
        }

        sendMessageArray.at(1)?.addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Agent', value: Player_Agent_Name, inline: true },
        );
        
        if(Match_Type !== 'deathmatch'){
            sendMessageArray.at(1)?.addField('Team', Player_Team, true);
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
                new MessageEmbed()
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

        /**
         * Finish
         */

        await interaction.editReply({
            embeds: sendMessageArray,
        });

    }
} as CustomSlashCommands;