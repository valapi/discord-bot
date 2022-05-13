interface ILanguage {
    language: string;
    data: {
        command: {
            'ping': {
                name: string;
                description: string;
            };
            'status': {
                name: string;
                description: string;
            };
            'account': {
                name: string;
                description: string;
                subCommand: {
                    'login': {
                        description: string;
                        options: {
                            'username': string;
                            'password': string;
                        };
                    };
                    'verify': {
                        description: string;
                        options: {
                            'verify_code': string;
                        };
                    };
                    'remove': {
                        description: string;
                    };
                    'get': {
                        description: string;
                    };
                };
            };
        };
    };
}
export { type ILanguage };
//# sourceMappingURL=controller.d.ts.map