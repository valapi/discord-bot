const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID = '1009662548013-oog4bla5put37cma3a9qh1otvp9lkso0.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URL = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//046tMoQOZuisjCgYIARAAGAQSNwF-L9IrCgvEG4Kzim0ifEAGlbNJ2iuN0Ta3bHCTCp87c5tnhlvWfEjShaubfaSzOTHfzJ-4ffw';
const SETTINGS_URL = 'https://developers.google.com/oauthplayground/#step3&scopes=https%3A%2F%2Fmail.google.com&url=https%3A%2F%2Fdevelopers.google.com%2Foauthplayground&content_type=application%2Fjson&http_method=GET&useDefaultOauthCred=checked&oauthEndpointSelect=Google&oauthAuthEndpointValue=https%3A%2F%2Faccounts.google.com%2Fo%2Foauth2%2Fv2%2Fauth&oauthTokenEndpointValue=https%3A%2F%2Foauth2.googleapis.com%2Ftoken&includeCredentials=unchecked&accessTokenType=bearer&autoRefreshToken=unchecked&accessType=offline&prompt=consent&response_type=code&wrapLines=on'

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