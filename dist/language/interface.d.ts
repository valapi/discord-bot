interface ILanguage {
    name: string;
    data: {
        error: string;
        command: {
            'ping': {
                'default': string;
            };
            'account': {
                'succes': string;
                'not_account': string;
                'verify': string;
                'remove': string;
            };
            'language': {
                'succes': string;
                'fail': string;
            };
            'profile': {
                'default': string;
            };
        };
    };
}
export type { ILanguage };
//# sourceMappingURL=interface.d.ts.map