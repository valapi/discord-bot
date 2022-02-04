const { SlashCommandBuilder } = require('@discordjs/builders');
const valorantApiCom = require('valorant-api-com');
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
            let valorantApiData = new valorantApiCom({
                'language': 'en-US'
            });

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

                        const Valorant = require('@liamcottle/valorant.js');
                        const valorantApi = new Valorant.API(Valorant.Regions.AsiaPacific);
                        valorantApi.authorize(_name, _password).then(async () => {

                            await valorantApi.getPlayerMatchHistory(valorantApi.user_id, 0, 25).then(async (response) => {
                                const getDatas = await response.data.History;
                                const matchIndex = await interaction.options.getNumber("index");
                                var _matchId;
                                try {
                                    _matchId = await getDatas[matchIndex + 0].MatchID;
                                } catch (err) {
                                    _matchId = await getDatas[0].MatchID;
                                    await interaction.editReply({
                                        content: `0 __>__ **Index** __>__ 25\n\nThis Time Will Use Default Index = 0`,
                                        ephemeral: true
                                    });
                                }
                                const getMatch = await valorantApi.getMatch(_matchId);
                                if (await getMatch.isComplete == false) {
                                    await interaction.editReply({
                                        content: `Something Went Wrong, Please Try Again Later`,
                                        ephemeral: true
                                    });
                                } else {
                                    let sendMessage = ``;
                                    var player_played_agent_display;
                                    //MATCH INFO
                                    sendMessage += `__Match Info__ -->\n\n`;
                                    //match id
                                    const match_id = await getMatch.data.matchInfo.matchId;
                                    sendMessage += `ID: **${await match_id}**\n`;
                                    //match type
                                    var match_mode = await getMatch.data.matchInfo.queueID;
                                    if (match_mode == '') {
                                        match_mode = 'custom'
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
                                    const getSeasons = await valorantApiData.getSeasons(get_season_id)
                                    sendMessage += `Season: **${await getSeasons.data.displayName}**\n`;
                                    //game start time
                                    const get_match_start_time = await getMatch.data.matchInfo.gameStartMillis;
                                    const start_time = new Date(await get_match_start_time);
                                    sendMessage += `Start At: **${await start_time.toString()}**\n`;
                                    //all player in match
                                    const get_all_player = await getMatch.data.players;
                                    sendMessage += `Players: **[`;
                                    for (let i = 0; i < get_all_player.length; i++) {
                                        sendMessage += ` ${await get_all_player[i].subject}, `;
                                    }
                                    sendMessage += `]**\n`;
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
                                    //PLAYER STATUS
                                    sendMessage += `\n__Player Status__ -->\n\n`;
                                    for (let i = 0; i < get_all_player.length; i++) {
                                        if (get_all_player[i].subject == valorantApi.user_id){
                                            sendMessage += `ID: **${await get_all_player[i].subject}**\n`;
                                            sendMessage += `Name: **${await get_all_player[i].gameName}#${await get_all_player[i].tagLine}**\n`;
                                            sendMessage += `Level: **${await get_all_player[i].accountLevel}**\n`;

                                            try {
                                                let total_damage = 0;
                                                for (let l = 0; l < get_all_player[i].roundDamage.length; l++) {
                                                    total_damage += await get_all_player[i].roundDamage[l].damage;
                                                }
                                                sendMessage += `Total Damage: **${await total_damage}**\n`;
                                            }catch (err) {

                                            }

                                            sendMessage += `Kill: **${await get_all_player[i].stats.kills}**\n`;
                                            sendMessage += `Death: **${await get_all_player[i].stats.deaths}**\n`;
                                            sendMessage += `Assists: **${await get_all_player[i].stats.assists}**\n`;

                                            const player_played_agent_id = await get_all_player[i].characterId;
                                            const find_played_agent = await valorantApiData.getAgents(await player_played_agent_id);
                                            const player_played_agent_name = await find_played_agent.data.displayName;
                                            const player_played_agent_role = await find_played_agent.data.role.displayName
                                            player_played_agent_display = await find_played_agent.data.displayIcon
                                            sendMessage += `Agent: **[ ${await player_played_agent_name} - ${player_played_agent_role} ]**\n`;
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
                                        .setTimestamp(createdTime)
                                        .setFooter({ text: `${await interaction.user.username}#${await interaction.user.discriminator}` });

                                    await interaction.editReply({
                                        content: ` `,
                                        embeds: [createEmbed],
                                        ephemeral: true
                                    });
                                }
                            })

                        }).catch((error) => {
                            console.log(error);
                        });
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
