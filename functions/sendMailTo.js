const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID = '1009662548013-oog4bla5put37cma3a9qh1otvp9lkso0.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URL = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04k6nUkNfLF42CgYIARAAGAQSNwF-L9Ir6tPs8Mrooddt50Qa20ECjsquQ81xgzSppYQHpc3YTWHSq-Or1ZNWB6lvSAg05arZT_A';

module.exports = (client) => {
    client.sendMailTo = async ({gmail, title, message}) => {
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
    
            const mailOptions = {
                from: 'ING PROJECT <kawinth.ingproject@gmail.com>',
                to: await gmail,
                subject: await title,
                text: await message,
            }
    
            //ballsupergamer@gmail.com
    
            const result = await transport.sendMail(mailOptions);

            return result;
    
        } catch (error){
            console.log(error);
        }
    };
}