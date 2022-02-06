const CryptoJS = require('crypto-js');

module.exports = (client) => {
    client.createSalt = async () => {
        try{
            var random_128_8 = CryptoJS.lib.WordArray.random(128 / 8)
            var random_256_32 = CryptoJS.lib.WordArray.random(256 / 32)
            var key512Bits1000Iterations = CryptoJS.PBKDF2(random_128_8, random_256_32, {
                keySize: 512 / 32,
                iterations: 1000
            })
    
            var make_Hex_512 = CryptoJS.enc.Hex.stringify(key512Bits1000Iterations)
            var make_64_512 = key512Bits1000Iterations.toString(CryptoJS.enc.Base64)
    
            var key256Bits = CryptoJS.PBKDF2(make_64_512, make_Hex_512, {
                keySize: 256 / 32
              })
    
            var make_Hex_256 = key256Bits.toString(CryptoJS.enc.Hex)
    
            var make_subString = make_Hex_256.substring(32, 64)
    
            var salt = make_subString.toUpperCase()
    
            return salt
        }catch (error) {
            console.error(error)
        } 
    };
}