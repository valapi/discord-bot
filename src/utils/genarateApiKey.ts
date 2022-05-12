import * as CryptoJS from 'crypto-js';

function genarateApiKey(key1:any, key2:any, key3:any):string {
    key1 = String(key1);
    key2 = String(key2);
    key3 = String(key3);

    const _key1 = Buffer.from(key1 + key2).toString('binary');
    const _key2 = Buffer.from(key3 + key1).toString('latin1');
    const _key3 = Buffer.from(key2 + key3).toString('utf16le');

    const MESSAGE = String(key1 + _key2 + key3).toUpperCase();
    const KEY = String(_key1 + key2 + _key3).toLocaleLowerCase();

    const ApiKey = CryptoJS.HmacSHA1(MESSAGE, KEY).toString(CryptoJS.enc.Hex);
    
    return ApiKey;
}

export default genarateApiKey;