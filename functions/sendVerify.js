const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID = '1009662548013-oog4bla5put37cma3a9qh1otvp9lkso0.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URL = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04k6nUkNfLF42CgYIARAAGAQSNwF-L9Ir6tPs8Mrooddt50Qa20ECjsquQ81xgzSppYQHpc3YTWHSq-Or1ZNWB6lvSAg05arZT_A';

module.exports = (client) => {
    client.sendVerify = async (Gmail) => {
        try {
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

            const verifyNumber = await Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            const sendGmail = await Gmail
    
            const mailOptions = {
                from: 'ING PROJECT <kawinth.ingproject@gmail.com>',
                to: sendGmail,
                subject: `Verify Code: ${await verifyNumber}`,
                text: `Your verify code is\n\n\n${await verifyNumber}\n\n\nWebsite: https://ingkth.wordpress.com/\nDiscord: https://discord.gg/pbyWbUYjyt\n\nING PROJECT.`,
            }
    
            //ballsupergamer@gmail.com
    
            const result = await transport.sendMail(mailOptions);

            return {result: result, verifyNumber: verifyNumber}
    
        } catch (error){
            console.log(error);
        }
    };
}