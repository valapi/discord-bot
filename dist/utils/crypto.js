"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = exports.genarateApiKey = void 0;
const tslib_1 = require("tslib");
const crypto_js_1 = tslib_1.__importDefault(require("crypto-js"));
function genarateApiKey(key1, key2, key3) {
    const _key1 = Buffer.from(key1 + key2).toString('binary');
    const _key2 = Buffer.from(key3 + key1).toString('latin1');
    const _key3 = Buffer.from(key2 + key3).toString('utf16le');
    return crypto_js_1.default.HmacSHA1(String(key1 + _key2 + key3).toUpperCase(), String(_key1 + key2 + _key3).toLocaleLowerCase()).toString(crypto_js_1.default.enc.Hex);
}
exports.genarateApiKey = genarateApiKey;
function encrypt(message, key) {
    const step0 = crypto_js_1.default.AES.encrypt(message, key).toString();
    const step1 = crypto_js_1.default.enc.Base64.parse(step0);
    return step1.toString(crypto_js_1.default.enc.Hex).toUpperCase();
}
exports.encrypt = encrypt;
function decrypt(message, key) {
    const step3 = crypto_js_1.default.enc.Hex.parse(message.toLowerCase());
    const step2 = step3.toString(crypto_js_1.default.enc.Base64);
    const step1 = crypto_js_1.default.AES.decrypt(step2, key);
    return step1.toString(crypto_js_1.default.enc.Utf8);
}
exports.decrypt = decrypt;