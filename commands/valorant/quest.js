const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const mongoose = require(`mongoose`);
const { MessageAttachment, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quest')
        .setDescription('Get Valorant Quest')
        .addStringOption(option => option.setName('privatekey').setDescription('Type Your Private Key')),

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
                        const getDatas = await client.getContractsByPlayer(ValorantAccount)

                        //weekly quest data
                        const week_start = getDatas.data.MissionMetadata.WeeklyCheckpoint;
                        const week_end = getDatas.data.MissionMetadata.WeeklyRefillTime;

                        var sendArray = [];

                        for (const PerMissions of getDatas.data.Missions) {
                            const getQuestMissions = await client.getQuestMissions(PerMissions.ID)

                            const quest_id = getQuestMissions.data.uuid;
                            const quest_title = getQuestMissions.data.title;
                            var quest_type;
                            if (getQuestMissions.data.type == 'EAresMissionType::Daily') {
                                quest_type = "Daily"
                            } else if (getQuestMissions.data.type == 'EAresMissionType::Weekly') {
                                quest_type = "Weekly"
                            }else {
                                quest_type = "Unknown"
                            }
                            const quest_xp = getQuestMissions.data.xpGrant;
                            const quest_toComplete = getQuestMissions.data.objectives[0].value;
                            const quest_objectivesId = getQuestMissions.data.objectives[0].objectiveUuid;

                            const quest_objectivesGet = PerMissions.Objectives[quest_objectivesId];
                            const quest_isCompleted = PerMissions.Complete;

                            const quest_end = PerMissions.ExpirationTime;
                            const quest_end_time = new Date(quest_end);

                            let sendMessage = ``;
                            sendMessage += `ID: **${quest_id}**\n`;
                            sendMessage += `Type: **${quest_type}**\n`;
                            sendMessage += `XP: **${quest_xp}**\n`;
                            sendMessage += `Progress: **${quest_objectivesGet} / ${quest_toComplete}**\n`;
                            sendMessage += `Expiration: **${quest_end_time.toString()}**\n`;

                            const createEmbed = new MessageEmbed()
                                .setColor(`#0099ff`)
                                .setTitle(quest_title)
                                .setDescription(await sendMessage)

                            if (quest_isCompleted == true) {
                                await createEmbed.setColor('#00ff00')
                            } else if (quest_isCompleted == false) {
                                if(quest_toComplete * 50/100 <= quest_objectivesGet){
                                    await createEmbed.setColor('#ffff00')
                                }else {
                                    await createEmbed.setColor('#ff0000')
                                }
                            }

                            await sendArray.push(createEmbed);
                        }

                        await interaction.editReply({
                            content: ` `,
                            embeds: await sendArray,
                            ephemeral: true
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
