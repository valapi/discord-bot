const CryptoJS = require('crypto-js');

module.exports = (client) => {
    client.encryptTo = async (string, salt) => {
        try {
            var encrypted = CryptoJS.AES.encrypt(string, salt).toString()
            return encrypted
        } catch (error) {
            console.error(error)
        }
    };
}