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

        //send today valorant shop data to gmail

        await client.dbLogin().then(async () => {
            const gmailSchema = new mongoose.Schema({
                mail: String,
                discordId: Number
            })
            try {
                const gmailAccount = await mongoose.model('gmails', gmailSchema);
                const gmailUsers = await gmailAccount.find({});
                for (let i = 0; i < await gmailUsers.length; i++) {
                    const _discordId = await gmailUsers[i].discordId;
                    const _gmail = await gmailUsers[i].mail;

                    const valorantSchema = new mongoose.Schema({
                        username: String,
                        password: String,
                        discordId: Number
                    })
                    try {
                        const valorantAccount = await mongoose.model('valorants', valorantSchema);
                        const valorantUser = await valorantAccount.findOne({ discordId: _discordId });

                        const keySchema = new mongoose.Schema({
                            key: String,
                            discordId: Number
                        })
                        try {
                            const keyAccount = await mongoose.model('keys', keySchema);
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
                                    
                                    const nodemailer = require('nodemailer');
                                    const { google } = require('googleapis');

                                    const CLIENT_ID = '1009662548013-oog4bla5put37cma3a9qh1otvp9lkso0.apps.googleusercontent.com';
                                    const CLIENT_SECRET = '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';
                                    const REDIRECT_URL = 'https://developers.google.com/oauthplayground';
                                    const REFRESH_TOKEN = '1//04k6nUkNfLF42CgYIARAAGAQSNwF-L9Ir6tPs8Mrooddt50Qa20ECjsquQ81xgzSppYQHpc3YTWHSq-Or1ZNWB6lvSAg05arZT_A';

                                    const oAuth2Client = await new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
                                    await oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

                                    const accessToken = await oAuth2Client.getAccessToken();

                                    const transport = nodemailer.createTransport({
                                        service: 'gmail',
                                        auth: {
                                            type: 'OAuth2',
                                            user: 'kawinth.ingproject@gmail.com',
                                            clientId: CLIENT_ID,
                                            clientSecret: CLIENT_SECRET,
                                            refreshToken: REFRESH_TOKEN,
                                            accessToken: accessToken
                                        },
                                        tls: {
                                            rejectUnauthorized: false
                                        }
                                    });

                                    sendMessage += `\n\nWebsite: https://ingkth.wordpress.com/\nDiscord: https://discord.gg/pbyWbUYjyt\n\nING PROJECT.`;

                                    const mailOptions = {
                                        from: 'ING PROJECT <kawinth.ingproject@gmail.com>',
                                        to: _gmail,
                                        subject: `Valorant Shop Today - ${new Date().toLocaleDateString()}`,
                                        text: await sendMessage,
                                    }

                                    await transport.sendMail(mailOptions);
                                });

                            }).catch((error) => {
                                console.log(error);
                            });

                        } catch (err) {

                        }

                    } catch (err) {

                    }
                }
            } catch (err) {

            }

        });
    };
}