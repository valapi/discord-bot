const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const mongoose = require(`mongoose`);
const { MessageAttachment, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Get Valorant Account Rank')
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

                        const Account = await client.valorantClientAPI(_name, _password);
                        const playerMMR = await client.getPlayerMMR(Account);
                        if (playerMMR.data.LatestCompetitiveUpdate) {
                            const CompetitiveUpdate = playerMMR.data.LatestCompetitiveUpdate;
                            let sendMessage = '';

                            //movement
                            var _Movement = CompetitiveUpdate.CompetitiveMovement

                            //elo
                            const _tier = CompetitiveUpdate.TierAfterUpdate
                            const _progress = CompetitiveUpdate.RankedRatingAfterUpdate

                            var _elo;
                            if (_tier >= 21) {
                                _elo = 1800 + _progress
                            } else {
                                _elo = ((_tier * 100) - 300) + _progress;
                            }

                            //tier
                            const getTiers = await client.getCompetitiveTiers()

                            var tier_name;
                            var tier_color;
                            var tier_backgroundColor;
                            var tier_smallIconUrl;
                            var tier_largeIconUrl;
                            const _thisForI = getTiers.data[getTiers.data.length - 1]
                            for (let l = 0; l < _thisForI.tiers.length; l++) {
                                const _thisForL = _thisForI.tiers[l]
                                if (_thisForL.tier == _tier) {
                                    tier_name = _thisForL.tierName
                                    tier_color = _thisForL.color
                                    tier_backgroundColor = _thisForL.backgroundColor
                                    tier_smallIconUrl = _thisForL.smallIcon
                                    tier_largeIconUrl = _thisForL.largeIcon
                                }
                            }

                            //sendMessage
                            sendMessage += `Tier: **${_tier}**\n`
                            sendMessage += `Progress: **${CompetitiveUpdate.RankedRatingAfterUpdate} / 100 **\n`
                            sendMessage += `Total Elo: **${_elo}**\n`
                            if (_Movement != "MOVEMENT_UNKNOWN") {
                                sendMessage += `Movement: **${_Movement}**\n`
                            }

                            const color_firstString = tier_backgroundColor  //"tier_color"  //"tier_backgroundColor"
                            const color_midString = color_firstString.substring(0, color_firstString.length - 1);
                            const color_endString = color_midString.substring(0, color_midString.length - 1);

                            if (_tier == 0 && CompetitiveUpdate.RankedRatingAfterUpdate == 0) {
                                await interaction.editReply({
                                    content: `**Sorry, Can't Find Your Latest Competitive Update,**\nSomething Went Wrong, Please Try Again Later`,
                                    ephemeral: true
                                });
                            } else {
                                const createEmbed = new MessageEmbed()
                                    .setColor(`#${color_endString}`)
                                    .setTitle(tier_name)
                                    .setAuthor({ name: `${await client.user.tag}`, iconURL: await client.user.displayAvatarURL(), url: `https://ingkth.wordpress.com` })
                                    .setDescription(await sendMessage)
                                    .setThumbnail(`${tier_smallIconUrl}`)  //"tier_smallIconUrl"  //"tier_largeIconUrl"
                                    .setTimestamp(createdTime)
                                    .setFooter({ text: `${await interaction.user.username}#${await interaction.user.discriminator}` });

                                await interaction.editReply({
                                    content: ` `,
                                    embeds: [createEmbed],
                                    ephemeral: true
                                });
                            }
                        } else {
                            await interaction.editReply({
                                content: `**Sorry, Can't Find Your Latest Competitive Update,**\nSomething Went Wrong, Please Try Again Later`,
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
