const valorantApiCom = require('valorant-api-com');
const fs = require('fs');
const mongoose = require(`mongoose`);

module.exports = (client) => {
    client.updateClient = async (client) => {

        // valorant api

        let valorantApi = new valorantApiCom({
            'language': 'en-US'
        });

        const getVersion = await valorantApi.getVersion();
        const dataArgs = await getVersion.data;
        const versionArgs = await dataArgs.branch;

        console.log(`Valorant Api Version: ${versionArgs}`);

        //status
        try {
            const getStatus = await client.getStatus(new Date());
            console.log(getStatus);
        }catch (err){
            console.log(err);
        }

        //send today valorant shop data to gmail

        await client.dbLogin().then(async () => {
            var gmailAccount;
            try {
                const gmailSchema = new mongoose.Schema({
                    mail: String,
                    discordId: Number
                })

                gmailAccount = await mongoose.model('gmails', gmailSchema);
            } catch (err) {
                gmailAccount = await mongoose.model('gmails');
            }

            const gmailUsers = await gmailAccount.find({});
            for (let i = 0; i < await gmailUsers.length; i++) {
                const _discordId = await gmailUsers[i].discordId;
                const _gmail = await gmailUsers[i].mail;

                var valorantAccount;
                try {
                    const valorantSchema = new mongoose.Schema({
                        username: String,
                        password: String,
                        discordId: Number
                    })

                    valorantAccount = await mongoose.model('valorants', valorantSchema);
                } catch (err) {
                    valorantAccount = await mongoose.model('valorants');
                }

                const valorantUser = await valorantAccount.findOne({ discordId: _discordId });

                var keyAccount;
                try {
                    const keySchema = new mongoose.Schema({
                        key: String,
                        discordId: Number
                    })
                    
                    keyAccount = await mongoose.model('keys', keySchema);
                } catch (err) {
                    keyAccount = await mongoose.model('keys');
                }

                const keyUser = await keyAccount.findOne({ discordId: _discordId });

                const _key = await keyUser.key;

                const _username = await client.decryptBack(await valorantUser.username, _key);
                const _password = await client.decryptBack(await valorantUser.password, _key);

                const Valorant = require('@liamcottle/valorant.js');
                const valorantApi = new Valorant.API(Valorant.Regions.AsiaPacific);
                valorantApi.authorize(_username, _password).then(async () => {

                    await valorantApi.getPlayerStoreFront(valorantApi.user_id).then(async (response) => {
                        let sec = await response.data.SkinsPanelLayout.SingleItemOffersRemainingDurationInSeconds;
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
                        sendMessage += `Valorant Shop - ${new Date().toString()}\n\n`;

                        let valorantApiData = new valorantApiCom({
                            'language': 'en-US'
                        });

                        let getDatas = await valorantApiData.getWeaponLevels();

                        sendMessage += `----------------------------------------------------\n\n`;

                        for (let i = 0; i < await response.data.SkinsPanelLayout.SingleItemOffers.length; i++) {
                            for (let l = 0; l < await getDatas.data.length; l++) {
                                if (getDatas.data[l].uuid === response.data.SkinsPanelLayout.SingleItemOffers[i]) {
                                    sendMessage += `Slot ${i + 1}: ${await getDatas.data[l].displayName}\n`
                                }
                            }

                            if (await response.data.SkinsPanelLayout.SingleItemOffers.length - 1 == i) {
                                sendMessage += `\nTime Left: ${await timeLeft}`
                            }
                        }

                        sendMessage += `\n----------------------------------------------------`;

                        //send gmail

                        sendMessage += `\n\nWebsite: https://ingkth.wordpress.com/\nDiscord: https://discord.gg/pbyWbUYjyt\n\nING PROJECT.`;

                        await client.sendMailTo({
                            gmail: await _gmail, 
                            title: `Valorant Shop Today - ${new Date().toLocaleDateString()}`, 
                            message: await sendMessage
                        });
                    });

                }).catch((error) => {
                    console.log(error);
                });
            }
        });
    };
}