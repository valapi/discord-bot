const CryptoJS = require('crypto-js');

module.exports = (client) => {
    client.random = async (min, max) => {
        try{
            const _randomMin = Math.ceil(min);
            const _randomMax = Math.floor(max);
            const _random =  Math.floor(Math.random() * (_randomMax - _randomMin + 1)) + _randomMin;
    
            return _random
        }catch (error) {
            console.error(error)
        } 
    };
}