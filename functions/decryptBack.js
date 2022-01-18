const CryptoJS = require('crypto-js');

module.exports = (client) => {
    client.decryptBack = async (encryptTo, salt) => {
        try {
            var decrypted = CryptoJS.AES.decrypt(encryptTo, salt).toString(CryptoJS.enc.Utf8)
            return decrypted
        } catch (error) {
            console.error(error)
        }
    };
}