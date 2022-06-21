type ILanguageName = `en_US` | `th_TH`;

interface ILanguage {
    name: ILanguageName;
    data: {
        not_guild: string,
        not_permission: string,
        dev_cmd: string,
        error: string,
        command: {
            'ping': {
                'default': string,
            },
            'account': {
                'succes': string,
                'not_account': string,
                'verify': string,
                'remove': string,
            },
            'language': {
                'succes': string,
                'fail': string,
            },
            'profile': {
                'default': string,
            },
            'store': {
                'not_nightmarket': string,
                'no_nightmarket': string,
            },
            'report': {
                'thanks': string,
                'topic_title': string,
                'topic_placeholder': string,
                'message_title': string,
                'message_placeholder': string,
            },
            'collection': {
                'default': string,
            },
            'party': {
                'not_party': string,
            },
        },
    };
}

export type { ILanguage, ILanguageName };