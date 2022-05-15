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
exports.getLanguageAndUndefined = exports.getLanguage = void 0;
const fs = __importStar(require("fs"));
const process = __importStar(require("process"));
const _defaultLanguage = 'en_US';
function getLanguage(language = _defaultLanguage) {
    const langFolder = fs.readdirSync(process.cwd() + '/dist/language/data').filter(file => file.endsWith('.js'));
    for (let i = 0; i < langFolder.length; i++) {
        const _lang = require(process.cwd() + `/dist/language/data/${langFolder[i]}`).default;
        if (!_lang) {
            continue;
        }
        if (_lang.name === language) {
            return _lang;
        }
    }
}
exports.getLanguage = getLanguage;
function getLanguageAndUndefined(language = _defaultLanguage) {
    const _lang = getLanguage(language);
    if (!_lang) {
        const _normalLang = getLanguage(_defaultLanguage);
        if (!_normalLang) {
            throw new Error('Default language is not found.');
        }
        return _normalLang;
    }
    return _lang;
}
exports.getLanguageAndUndefined = getLanguageAndUndefined;
//# sourceMappingURL=controller.js.map