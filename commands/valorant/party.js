const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const mongoose = require(`mongoose`);
const { MessageAttachment, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('party')
        .setDescription('Get Party From Account')
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
                        const getPartyByPlayer = await client.getPartyByPlayer(ValorantAccount);

                        let sendMessage = ``;

                        try {
                            if (getPartyByPlayer.isError == false) {
                                const getDatas = await getPartyByPlayer.data;
                                //id
                                sendMessage += `ID: **${await getDatas.ID}**\n`;
                                //__spacebar
                                sendMessage += `\n`;
                                //create at
                                const get_create = await getDatas.Version
                                const create_to_time = await new Date(get_create);
                                const create_time = await create_to_time.toString();
                                sendMessage += `Create At: **${await create_time}**\n`;
                                //__spacebar
                                sendMessage += `\n`;
                                //match making
                                var get_matchmaking = await getDatas.MatchmakingData.QueueID
                                if (getDatas.State == 'DEFAULT') {
                                    if (get_matchmaking == '') {
                                        get_matchmaking = 'custom'
                                    } else if (get_matchmaking == 'ggteam') {
                                        get_matchmaking = 'escalation'
                                    } else if (get_matchmaking == 'onefa') {
                                        get_matchmaking = 'replication'
                                    }

                                    sendMessage += `Match Making: **${await get_matchmaking}**\n`;
                                }
                                //request
                                const get_request = await getDatas.Requests
                                if (await get_request.length != 0) {
                                    sendMessage += `\n`;
                                    sendMessage += `Requests: **[`;
                                    for (let i = 0; i < await get_request.length; i++) {
                                        sendMessage += ` ${await get_request[i].PartyID}, `
                                    }
                                    sendMessage += `]**\n`;
                                }
                                //invite
                                const get_invite = await getDatas.Invites
                                if (await get_invite.length != 0) {
                                    sendMessage += `\n`;
                                    sendMessage += `Invites: **[`;
                                    for (let i = 0; i < await get_invite.length; i++) {
                                        sendMessage += ` ${await get_invite[i].PartyID}, `
                                    }
                                    sendMessage += `]**\n`;
                                }
                            }else {
                                throw new Error(getPartyByPlayer.data);
                            }
                        } catch (err) {
                            await interaction.editReply({
                                content: `**You Are Not Online**,\nSomething Went Wrong, Please Try Again Later`,
                                ephemeral: true
                            });
                        }

                        if (sendMessage == ``) {
                            await interaction.editReply({
                                content: `**You Are Not Online**,\nSomething Went Wrong, Please Try Again Later`,
                                ephemeral: true
                            });
                        } else {
                            const createEmbed = new MessageEmbed()
                                .setColor(`#0099ff`)
                                .setTitle(`/${await interaction.commandName}`)
                                .setURL(`https://ingkth.wordpress.com`)
                                .setAuthor({ name: `${await client.user.tag}`, iconURL: await client.user.displayAvatarURL(), url: `https://ingkth.wordpress.com` })
                                .setDescription(await sendMessage)
                                .setTimestamp(createdTime)
                                .setFooter({ text: `${await interaction.user.username}#${await interaction.user.discriminator}` });

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
