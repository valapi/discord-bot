const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const mongoose = require(`mongoose`);
const valorantApiCom = require('valorant-api-com');
const { MessageAttachment, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('store')
        .setDescription('Valorant Daily Store')
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

                    if (_key == null){
                        await interaction.editReply({
                            content: `Sorry, You Must Type Your Private Key`,
                            ephemeral: true
                        });
                    }else {
                        const _name = await client.decryptBack(await user.username, _key);
                        const _password = await client.decryptBack(await user.password, _key);

                        const Valorant = require('@liamcottle/valorant.js');
                        const valorantApi = new Valorant.API(Valorant.Regions.AsiaPacific);
                        valorantApi.authorize(_name, _password).then(async () => {

                            await valorantApi.getPlayerStoreFront(valorantApi.user_id).then(async (response) => {
                                let sec = response.data.SkinsPanelLayout.SingleItemOffersRemainingDurationInSeconds;
                                let min = 0;
                                let hour = 0;

                                while (sec >= 60) {
                                    min++;
                                    sec -= 60;
                                }

                                while (min >= 60) {
                                    hour++;
                                    min -= 60;
                                }

                                const timeLeft = `${hour} hour(s) ${min} minute(s) ${sec} second(s)`

                                let sendMessage = ``;

                                let valorantApiData = new valorantApiCom({
                                    'language': 'en-US'
                                });

                                let getDatas = await valorantApiData.getWeaponLevels();

                                for (let i = 0; i < response.data.SkinsPanelLayout.SingleItemOffers.length; i++) {
                                    for (let l = 0; l < getDatas.data.length; l++) {
                                        if (getDatas.data[l].uuid === response.data.SkinsPanelLayout.SingleItemOffers[i]) {
                                            sendMessage += `Slot ${i + 1}: **${await getDatas.data[l].displayName}\n**`
                                        }
                                    }

                                    if (response.data.SkinsPanelLayout.SingleItemOffers.length - 1 == i) {
                                        sendMessage += `\nTime Left: **${await timeLeft}**`
                                    }
                                }

                                await interaction.editReply({
                                    content: sendMessage,
                                    ephemeral: true
                                });
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
