//import

import * as fs from 'fs';
import * as path from 'path';

import { Locale } from '@valapi/lib';

//interface

namespace ILanguage {
    export type Name = keyof typeof Locale.from;

    export interface File {
        name: ILanguage.Name;
        data: {
            'not_guild': string,
            'not_permission': string,
            'dev_cmd': string,
            'error': string,
            command: {
                ping: {
                    'default': string,
                },
                account: {
                    'succes': string,
                    'not_account': string,
                    'verify': string,
                    'remove': string,
                    'reconnect': string,
                },
                language: {
                    'succes': string,
                    'fail': string,
                },
                profile: {
                    'default': string,
                },
                store: {
                    'not_nightmarket': string,
                    'no_nightmarket': string,
                },
                report: {
                    'thanks': string,
                    'topic_title': string,
                    'topic_placeholder': string,
                    'message_title': string,
                    'message_placeholder': string,
                },
                collection: {
                    'default': string,
                },
                party: {
                    'not_party': string,
                },
                help: {
                    'select_category': string,
                    'not_category': string,
                    'placeholder': string,
                    'type_settings': string,
                    'type_infomation': string,
                    'type_valorant': string,
                    'type_miscellaneous': string,
                },
                match: {
                    'not_match': string;
                }
            },
        };
    }

    export const DefaultLanguage = `en-US`;
}

//function

function getLanguage(language: ILanguage.Name = ILanguage.DefaultLanguage): ILanguage.File | void {
    for (const _file of fs.readdirSync(path.join(`${__dirname}/language`))) {
        const _language: ILanguage.File = JSON.parse(fs.readFileSync(path.join(`${__dirname}/language/${_file}`)).toString()).default;

        if (!_language) {
            continue;
        }

        if (_language.name === language) {
            return _language;
        }
    }
}

function getLanguageAndUndefined(language: ILanguage.Name = ILanguage.DefaultLanguage): ILanguage.File {
    const _language = getLanguage(language);

    if (_language) {
        return _language;
    }

    const _default = getLanguage(ILanguage.DefaultLanguage);

    if (_default) {
        return _default;
    }

    throw new Error(
        'Default language is not found.'
    );
}

//export

export {
    ILanguage,
    getLanguage, getLanguageAndUndefined
};