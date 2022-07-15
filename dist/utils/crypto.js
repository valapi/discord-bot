"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = exports.genarateApiKey = void 0;
const tslib_1 = require("tslib");
const crypto_js_1 = tslib_1.__importDefault(require("crypto-js"));
function genarateApiKey(key1, key2, key3) {
    key1 = String(key1);
    key2 = String(key2);
    key3 = String(key3);
    const _key1 = Buffer.from(key1 + key2).toString('binary');
    const _key2 = Buffer.from(key3 + key1).toString('latin1');
    const _key3 = Buffer.from(key2 + key3).toString('utf16le');
    const MESSAGE = String(key1 + _key2 + key3).toUpperCase();
    const KEY = String(_key1 + key2 + _key3).toLocaleLowerCase();
    const ApiKey = crypto_js_1.default.HmacSHA1(MESSAGE, KEY).toString(crypto_js_1.default.enc.Hex);
    return ApiKey;
}
exports.genarateApiKey = genarateApiKey;
function encrypt(message, key) {
    const step0 = crypto_js_1.default.AES.encrypt(message, key).toString();
    const step1 = crypto_js_1.default.enc.Base64.parse(step0);
    const step2 = step1.toString(crypto_js_1.default.enc.Hex).toUpperCase();
    return step2;
}
exports.encrypt = encrypt;
function decrypt(message, key) {
    const step4 = message.toLowerCase();
    const step3 = crypto_js_1.default.enc.Hex.parse(step4);
    const step2 = step3.toString(crypto_js_1.default.enc.Base64);
    const step1 = crypto_js_1.default.AES.decrypt(step2, key);
    const step0 = step1.toString(crypto_js_1.default.enc.Utf8);
    return step0;
}
exports.decrypt = decrypt;
