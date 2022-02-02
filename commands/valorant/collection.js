const { SlashCommandBuilder } = require('@discordjs/builders');
const valorantApiCom = require('valorant-api-com');
const fs = require('fs');
const mongoose = require(`mongoose`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('collection')
        .setDescription('Get My Valorant Items Collection From Account')
        .addStringOption(option => option.setName('privatekey').setDescription('Type Your Private Key')),

    async execute(interaction, client) {
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
                            
                            await valorantApi.getPlayerLoadout(valorantApi.user_id).then(async (response) => {
                                const getDatas = await response.data;
                                const valorantApiData = new valorantApiCom({
                                    'language': 'en-US'
                                });

                                //Guns
                                const getGuns = await getDatas.Guns;
                                sendMessage += `Guns: **[`;
                                for (let i = 0; i < getGuns.length; i++){
                                    const skinLevel = await getDatas.Guns[i].SkinID;
    
                                    const getSkinApi = await valorantApiData.getWeaponSkins(await skinLevel);
                                    const getSkinName = await getSkinApi.data.displayName;
                                    
                                    sendMessage += ` ${getSkinName}, `;
                                }
                                sendMessage += `]**\n\n`;

                                //Sprays
                                const getSprays = await getDatas.Sprays;
                                sendMessage += `Sprays: **[`;
                                for (let i = 0; i < getSprays.length; i++){
                                    const sprayId = await getDatas.Sprays[i].SprayID;
    
                                    const getSprayApi = await valorantApiData.getSprays(await sprayId)
                                    const getSprayName = await getSprayApi.data.displayName;
                                    
                                    sendMessage += ` ${getSprayName}, `;
                                }
                                sendMessage += `]**\n\n`;

                                //Identity
                                const getIdentity = await getDatas.Identity;

                                const get_card_id = await getIdentity.PlayerCardID
                                const find_card = await valorantApiData.getPlayerCards(await get_card_id)
                                const player_card = await find_card.data.displayName;
                                sendMessage += `Player Card: **${player_card}**`;

                                const get_title_id = await getIdentity.PlayerTitleID
                                const find_title = await valorantApiData.getPlayerTitles(await get_title_id)
                                const player_title_name = await find_title.data.displayName;
                                const player_title_display = await find_title.data.titleText;
                                if (player_title_display != null) {
                                    sendMessage += `\n\nPlayer Title: **[ ${player_title_name} - ${player_title_display} ]**`;
                                }
                            })  
                            
                            await interaction.editReply({
                                content: sendMessage,
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
