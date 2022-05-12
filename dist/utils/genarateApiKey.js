"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const CryptoJS = __importStar(require("crypto-js"));
function genarateApiKey(key1, key2, key3) {
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
exports.default = genarateApiKey;
//# sourceMappingURL=genarateApiKey.js.map