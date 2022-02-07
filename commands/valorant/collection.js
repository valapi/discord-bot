const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const mongoose = require(`mongoose`);
const { MessageAttachment, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('collection')
        .setDescription('Get My Valorant Items Collection From Account')
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

                        const Valorant = require('@liamcottle/valorant.js');
                        const valorantApi = new Valorant.API(Valorant.Regions.AsiaPacific);
                        await valorantApi.authorize(_name, _password).then(async () => {

                            let sendMessage = ``;
                            var player_display_icon;
                            var player_card_long;

                            await valorantApi.getPlayerLoadout(valorantApi.user_id).then(async (response) => {
                                const getDatas = await response.data;

                                //Guns
                                const getGuns = await getDatas.Guns;
                                sendMessage += `Weapons: **[`;
                                for (let i = 0; i < getGuns.length; i++) {
                                    const skinLevel = await getDatas.Guns[i].SkinID;

                                    const getSkinApi = await client.getWeaponSkins(await skinLevel);
                                    const getSkinName = await getSkinApi.data.displayName;

                                    sendMessage += ` ${getSkinName}, `;
                                }
                                sendMessage += `]**\n\n`;

                                //Sprays
                                const getSprays = await getDatas.Sprays;
                                sendMessage += `Sprays: **[`;
                                for (let i = 0; i < getSprays.length; i++) {
                                    const sprayId = await getDatas.Sprays[i].SprayID;

                                    const getSprayApi = await client.getSprays(await sprayId)
                                    const getSprayName = await getSprayApi.data.displayName;

                                    if (getSprays.length - 1 == i){
                                        player_display_icon = await getSprayApi.data.fullTransparentIcon;  //".displayIcon"  //".fullIcon"  //".fullTransparentIcon"
                                    }

                                    sendMessage += ` ${getSprayName}, `;
                                }
                                sendMessage += `]**\n\n`;

                                //Identity
                                const getIdentity = await getDatas.Identity;

                                const get_card_id = await getIdentity.PlayerCardID
                                const find_card = await client.getPlayerCards(await get_card_id)
                                player_card_long = await find_card.data.wideArt;  //".wideArt"  //".largeArt"  //".displayIcon"  //".smallArt"
                                const player_card = await find_card.data.displayName;
                                sendMessage += `Player Card: **${player_card}**`;

                                const get_title_id = await getIdentity.PlayerTitleID
                                const find_title = await client.getPlayerTitles(await get_title_id)
                                const player_title_name = await find_title.data.displayName;
                                const player_title_display = await find_title.data.titleText;
                                if (player_title_display != null) {
                                    sendMessage += `\n\nPlayer Title: **[ ${player_title_name} - ${player_title_display} ]**`;
                                }
                            })

                            const createEmbed = new MessageEmbed()
                                .setColor(`#0099ff`)
                                .setTitle(`/${await interaction.commandName}`)
                                .setURL(`https://ingkth.wordpress.com`)
                                .setAuthor({ name: `${await client.user.tag}`, iconURL: await client.user.displayAvatarURL(), url: `https://ingkth.wordpress.com` })
                                .setDescription(await sendMessage)
                                .setThumbnail(await player_display_icon)
                                .setImage(await player_card_long)
                                .setTimestamp(createdTime)
                                .setFooter({ text: `${await interaction.user.username}#${await interaction.user.discriminator}` });

                            await interaction.editReply({
                                content: ` `,
                                embeds: [createEmbed],
                                ephemeral: true
                            });

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
