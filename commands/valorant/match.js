const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const mongoose = require(`mongoose`);
const { MessageAttachment, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('match')
        .setDescription('Get Played Match History From Account')
        .addStringOption(option => option.setName('privatekey').setDescription('Type Your Private Key'))
        .addNumberOption(option => option.setName('index').setDescription('Type Match Index Id')),

    async execute(interaction, client, createdTime) {
        try {
            var _key = await interaction.options.getString("privatekey");
            await client.dbLogin().then(async () => {
                var Account;
                try {
                    const valorantSchema = new mongoose.Schema({
                        username: String,
                        password: String,
                        discordId: Number
                    })

                    Account = await mongoose.model('valorants', valorantSchema);
                } catch (err) {
                    Account = await mongoose.model('valorants');
                }
                //script
                const user = await Account.findOne({ discordId: await interaction.user.id });
                if (user == null) {
                    await interaction.editReply({
                        content: `Can't Find Your Account In Database`,
                        ephemeral: true
                    });
                } else {
                    if (_key == null) {
                        //try to find key in database
                        var tryToFindKey;
                        try {
                            const keySchema = new mongoose.Schema({
                                key: String,
                                discordId: Number
                            })

                            tryToFindKey = await mongoose.model('keys', keySchema);
                        } catch (err) {
                            tryToFindKey = await mongoose.model('keys');
                        }
                        getKeyUser = await tryToFindKey.findOne({ discordId: await interaction.user.id });
                        if (getKeyUser || getKeyUser != null || getKeyUser != undefined) {
                            _key = await getKeyUser.key;
                        }
                    }

                    if (_key == null) {
                        await interaction.editReply({
                            content: `Sorry, You Must Type Your Private Key`,
                            ephemeral: true
                        });
                    } else {
                        const _name = await client.decryptBack(await user.username, _key);
                        const _password = await client.decryptBack(await user.password, _key);

                        const ValorantAccount = await client.valorantClientAPI(_name, _password);
                        const matchHistory = await client.getMatchHistory(ValorantAccount, 0, 20);

                        const getDatas = await matchHistory.data.History;
                        const matchIndex = await interaction.options.getNumber("index");
                        var _matchId;
                        try {
                            _matchId = await getDatas[matchIndex + 0].MatchID;
                        } catch (err) {
                            const _random = await client.random(0, 20)
                            await interaction.editReply({
                                content: `**This Time Will Use Index = ${await _random},**\nSomething Went Wrong, Please Try Again Later`,
                                ephemeral: true
                            });
                            _matchId = await getDatas[await _random].MatchID;
                            await client.wait(2.5);
                        }
                        const getMatch = await client.getMatchDetails(ValorantAccount, _matchId);
                        if (await getMatch.data.matchInfo.isCompleted == false) {
                            await interaction.editReply({
                                content: `Something Went Wrong, Please Try Again Later`,
                                ephemeral: true
                            });
                        } else {
                            let sendMessage = ``;
                            var player_played_agent_display;
                            var player_played_map_display;
                            var player_played_is_won;
                            //MATCH INFO
                            sendMessage += `__Match Info__ -->\n\n`;
                            //match id
                            const match_id = await getMatch.data.matchInfo.matchId;
                            sendMessage += `ID: **${await match_id}**\n`;
                            //map name
                            const map_id = await getMatch.data.matchInfo.mapId;
                            const getMaps_data = await client.getMaps();
                            const getMaps = getMaps_data.data
                            for (let i = 0; i < getMaps.length; i++) {
                                if (getMaps[i].mapUrl == map_id) {
                                    sendMessage += `Map: **${await getMaps[i].displayName}**\n`;
                                    player_played_map_display = await getMaps[i].listViewIcon; //".splash"  //".listViewIcon"
                                }
                            }
                            //match type
                            var match_mode = await getMatch.data.matchInfo.queueID;
                            if (match_mode == '') {
                                match_mode = 'custom'
                            } else if (match_mode == 'ggteam') {
                                match_mode = 'escalation'
                            }
                            sendMessage += `Mode: **${await match_mode}**\n`;
                            //match duration
                            const get_match_duration = await getMatch.data.matchInfo.gameLengthMillis;
                            let duration_sec = get_match_duration / 1000;
                            let duration_min = 0;
                            let duration_hour = 0;
                            while (duration_sec > 60) {
                                duration_sec -= 60;
                                duration_min++;
                            }
                            while (duration_min > 60) {
                                duration_min -= 60;
                                duration_hour++;
                            }
                            sendMessage += `Duration: **${await duration_hour} Hours : ${await duration_min} Minutes : ${await duration_sec | 0} Seconds**\n`;
                            //match played in season
                            const get_season_id = await getMatch.data.matchInfo.seasonId;
                            const getSeasons = await client.getSeasons(get_season_id)
                            sendMessage += `Season: **${await getSeasons.data.displayName}**\n`;
                            //game start time
                            const get_match_start_time = await getMatch.data.matchInfo.gameStartMillis;
                            const start_time = new Date(await get_match_start_time);
                            sendMessage += `Start At: **${await start_time.toString()}**\n`;
                            //all round in match
                            const get_all_round = await getMatch.data.roundResults;
                            const get_round = await get_all_round[await get_all_round.length - 1];
                            const all_round = await get_round.roundNum
                            if (all_round > 0) {
                                const get_team_round = await getMatch.data.teams;
                                let scoreTeamMessage = ``;
                                scoreTeamMessage += `[`;
                                for (let i = 0; i < get_team_round.length; i++) {
                                    scoreTeamMessage += ` ${get_team_round[i].numPoints}, `
                                }
                                scoreTeamMessage += `]`;

                                sendMessage += `Score: **${await scoreTeamMessage}**\n`;
                            }
                            //LEADERBAORD
                            sendMessage += `\n__Leaderboard__ -->\n\n`;
                            const get_all_player = await getMatch.data.players;
                            const sort_player = await get_all_player.sort((a, b) => {
                                if (a.stats.kills > b.stats.kills) {
                                    return -1;
                                } else if (a.stats.kills < b.stats.kills) {
                                    return 1;
                                } else {
                                    if (a.stats.deaths > b.stats.deaths) {
                                        return -1;
                                    } else if (a.stats.deaths < b.stats.deaths) {
                                        return 1;
                                    } else {
                                        if (a.stats.assists > b.stats.assists) {
                                            return -1;
                                        } else if (a.stats.assists < b.stats.assists) {
                                            return 1;
                                        } else {
                                            return 0;
                                        }
                                    }
                                }
                            });
                            //get_all_player[i].stats of kills then get_all_player[i].stats of deaths then get_all_player[i].stats of assists
                            for (let i = 0; i < sort_player.length; i++) {
                                sendMessage += `${i + 1}. **${await sort_player[i].gameName} # ${await sort_player[i].tagLine}** \n `;
                                sendMessage += `Kills: **${await sort_player[i].stats.kills}**  /  `;
                                sendMessage += `Deaths: **${await sort_player[i].stats.deaths}**  /  `;
                                sendMessage += `Assists: **${await sort_player[i].stats.assists}**  /  `;
                                sendMessage += `Level: **${sort_player[i].accountLevel}**  \n  `;

                                const player_played_in_team_id = await sort_player[i].teamId;
                                const get_teams = await getMatch.data.teams;
                                for (let l = 0; l < get_teams.length; l++) {
                                    if (get_teams[l].teamId == player_played_in_team_id) {
                                        if (match_mode != 'deathmatch') {
                                            sendMessage += `Team: **${get_teams[l].teamId}**  /  `;
                                        }

                                        if (sort_player[i].subject == ValorantAccount.user.id) {
                                            player_played_is_won = get_teams[l].won
                                        }
                                    }
                                }

                                const player_played_agent_id = await sort_player[i].characterId;
                                const find_played_agent = await client.getAgent(await player_played_agent_id);
                                const player_played_agent_name = await find_played_agent.data.displayName;
                                const player_played_agent_role = await find_played_agent.data.role.displayName;
                                sendMessage += `Agent: **[ ${await player_played_agent_name} - ${player_played_agent_role} ]**\n`;

                                if (sort_player[i].subject == ValorantAccount.user.id) {
                                    player_played_agent_display = find_played_agent.data.displayIcon //".displayIconSmall"  //".displayIcon"
                                }

                                if (sort_player.length - 1 != i) {
                                    sendMessage += `\n\n`;
                                } else {
                                    sendMessage += `\n`;
                                }
                            }

                            //TEAM
                            if (match_mode != 'deathmatch') {
                                sendMessage += `__Team__ -->\n\n`;
                                const get_all_team = await getMatch.data.teams;
                                for (let i = 0; i < get_all_team.length; i++) {
                                    sendMessage += `${get_all_team[i].teamId} : **[ Point: ${get_all_team[i].numPoints} - Won: ${get_all_team[i].won.toString()}]**\n`;
                                }
                            }

                            //send message
                            const createEmbed = new MessageEmbed()
                                .setColor(`#0099ff`)
                                .setTitle(`/${await interaction.commandName}`)
                                .setURL(`https://ingkth.wordpress.com`)
                                .setAuthor({ name: `${await client.user.tag}`, iconURL: await client.user.displayAvatarURL(), url: `https://ingkth.wordpress.com` })
                                .setDescription(await sendMessage)
                                .setThumbnail(await player_played_agent_display)
                                .setImage(await player_played_map_display)
                                .setTimestamp(createdTime)
                                .setFooter({ text: `${await interaction.user.username}#${await interaction.user.discriminator}` });

                            if (match_mode != 'deathmatch') {
                                if (player_played_is_won == true) {
                                    await createEmbed.setColor('#00ff00')
                                } else if (player_played_is_won == false) {
                                    await createEmbed.setColor('#ff0000')
                                }
                            }

                            await interaction.editReply({
                                content: ` `,
                                embeds: [createEmbed],
                                ephemeral: true
                            });
                        }
                    }
                }
            });

        } catch (err) {
            console.error(err);
            await interaction.editReply({
                content: `Something Went Wrong, Please Try Again Later`,
                ephemeral: true
            });
        }
    }
}
