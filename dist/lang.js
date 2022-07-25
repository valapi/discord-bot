"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLanguageAndUndefined = exports.getLanguage = exports.ILanguage = void 0;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const path = tslib_1.__importStar(require("path"));
var ILanguage;
(function (ILanguage) {
    ILanguage.DefaultLanguage = `en-US`;
})(ILanguage || (ILanguage = {}));
exports.ILanguage = ILanguage;
function getLanguage(language = ILanguage.DefaultLanguage) {
    for (const _file of fs.readdirSync(path.join(`${__dirname}/language`))) {
        const _language = require(`./language/${_file}`).default;
        if (!_language) {
            continue;
        }
        if (_language.name === language) {
            return _language;
        }
    }
}
exports.getLanguage = getLanguage;
function getLanguageAndUndefined(language = ILanguage.DefaultLanguage) {
    const _language = getLanguage(language);
    if (_language) {
        return _language;
    }
    const _default = getLanguage(ILanguage.DefaultLanguage);
    if (_default) {
        return _default;
    }
    throw new Error('Default language is not found.');
}
exports.getLanguageAndUndefined = getLanguageAndUndefined;
