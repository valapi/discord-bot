const CryptoJS = require('crypto-js');

module.exports = (client) => {
    client.decryptBack = async (encryptTo, salt) => {
        try {
            const step4 = encryptTo.toLowerCase();
            const step3 = CryptoJS.enc.Hex.parse(step4);
            const step2 = step3.toString(CryptoJS.enc.Base64);
            const step1 = CryptoJS.AES.decrypt(step2, salt);
            const step0 = step1.toString(CryptoJS.enc.Utf8);

            return step0
        } catch (error) {
            console.error(error)
        }
    };
}