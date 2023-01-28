// import

import * as fs from "fs";
import * as path from "path";

import type { ValorantApiCom } from "@valapi/valorant-api.com";

// interface

namespace ILanguage {
    export type Name = ValorantApiCom.Language;

    export interface File {
        name: ILanguage.Name;
        displayName: string;
        data: {
            not_guild: string;
            not_permission: string;
            dev_cmd: string;
            error: string;
            command: {
                ping: {
                    default: string;
                };
                account: {
                    succes: string;
                    not_account: string;
                    verify: string;
                    remove: string;
                    reconnect: string;
                };
                language: {
                    succes: string;
                    fail: string;
                };
                profile: {
                    default: string;
                };
                store: {
                    not_nightmarket: string;
                    no_nightmarket: string;
                };
                report: {
                    thanks: string;
                    topic_title: string;
                    topic_placeholder: string;
                    message_title: string;
                    message_placeholder: string;
                };
                collection: {
                    default: string;
                };
                party: {
                    not_party: string;
                };
                help: {
                    select_category: string;
                    not_category: string;
                    placeholder: string;
                    type_settings: string;
                    type_infomation: string;
                    type_valorant: string;
                    type_miscellaneous: string;
                };
                match: {
                    not_match: string;
                };
            };
        };
    }

    export const DefaultLanguage = `en-US`;
}

// function

async function getLanguage(language: ILanguage.Name = ILanguage.DefaultLanguage): Promise<ILanguage.File | void> {
    for (const _file of fs.readdirSync(path.join(`${__dirname}/language`))) {
        const _language: ILanguage.File = await require(`./language/${_file}`).default;

        if (!_language) {
            continue;
        }

        if (_language.name === language) {
            return _language;
        }
    }
}

async function getLanguageAndUndefined(
    language: ILanguage.Name = ILanguage.DefaultLanguage
): Promise<ILanguage.File> {
    const _language = await getLanguage(language);
    if (_language) {
        return _language;
    }

    const _default = await getLanguage(ILanguage.DefaultLanguage);
    if (_default) {
        return _default;
    }

    throw new Error("Default language is not found.");
}

// export

export { ILanguage, getLanguage, getLanguageAndUndefined };
