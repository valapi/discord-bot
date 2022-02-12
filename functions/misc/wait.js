const CryptoJS = require('crypto-js');

module.exports = (client) => {
    client.wait = async (seconds) => {
        try {
            const _milliseconds = await seconds * 1000;
            const _time = _milliseconds | 0
            return await new Promise(res => setTimeout(res, _time));
        }catch (error) {
            console.error(error)
        }
    };
}