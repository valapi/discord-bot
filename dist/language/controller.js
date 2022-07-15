"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultLanguage = exports.getLanguageAndUndefined = exports.getLanguage = void 0;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const process = tslib_1.__importStar(require("process"));
const _defaultLanguage = 'en_US';
exports.defaultLanguage = _defaultLanguage;
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
