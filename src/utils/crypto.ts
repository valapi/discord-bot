import CryptoJS from "crypto-js";

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

function encrypt(message: string, key: string): string {
    const step0 = CryptoJS.AES.encrypt(message, key).toString();
    const step1 = CryptoJS.enc.Base64.parse(step0);
    const step2 = step1.toString(CryptoJS.enc.Hex).toUpperCase();

    return step2
}

function decrypt(message: string, key: string): string {
    const step4 = message.toLowerCase();
    const step3 = CryptoJS.enc.Hex.parse(step4);
    const step2 = step3.toString(CryptoJS.enc.Base64);
    const step1 = CryptoJS.AES.decrypt(step2, key);
    const step0 = step1.toString(CryptoJS.enc.Utf8);

    return step0
}

export {
    genarateApiKey,
    encrypt,
    decrypt,
};