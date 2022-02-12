const CryptoJS = require('crypto-js');

module.exports = (client) => {
    client.encryptTo = async (string, salt) => {
        try {
            const step0 = CryptoJS.AES.encrypt(string, salt).toString();
            const step1 = CryptoJS.enc.Base64.parse(step0);
            const step2 = step1.toString(CryptoJS.enc.Hex).toUpperCase();

            return step2
        } catch (error) {
            console.error(error)
        }
    };
}