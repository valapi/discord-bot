interface ILanguage {
    name: string;
    data: {
        not_guild: string;
        not_permission: string;
        error: string,
        command: {
            'ping': {
                'default': string;
            };
            'account': {
                'succes': string,
                'not_account': string;
                'verify': string;
                'remove': string;
            };
            'language': {
                'succes': string,
                'fail': string,
            };
            'profile': {
                'default': string;
            };
            'store': {
                'not_nightmarket': string;
                'no_nightmarket': string;
            };
            'report': {
                'thanks': string;
            };
            'collection': {
                'default': string;
            };
        },
    },
}

export type { ILanguage };