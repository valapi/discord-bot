import * as fs from 'fs';
import * as process from 'process';

import type { ILanguage } from "./interface";

const _defaultLanguage:string = 'en_US'

function getLanguage (language:string = _defaultLanguage):ILanguage | void {
    const langFolder = fs.readdirSync(process.cwd() + '/dist/language/data').filter(file => file.endsWith('.js'));

    for(let i = 0; i < langFolder.length; i++){
        const _lang = require(process.cwd() + `/dist/language/data/${langFolder[i]}`).default as ILanguage;

        if(!_lang){
            continue;
        }

        if(_lang.name === language){
            return _lang;
        }
    }
}

function getLanguageAndUndefined (language:string = _defaultLanguage):ILanguage {
    const _lang = getLanguage(language);

    if(!_lang){
        const _normalLang = getLanguage(_defaultLanguage);

        if(!_normalLang){
            throw new Error('Default language is not found.');
        }

        return _normalLang;
    }

    return _lang;
}

export { 
    getLanguage, 
    getLanguageAndUndefined, 
    _defaultLanguage as defaultLanguage,
};