interface ILanguage {
    language: string;
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
        };
    };
}
export type { ILanguage };
//# sourceMappingURL=interface.d.ts.map