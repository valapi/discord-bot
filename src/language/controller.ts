interface ILanguage {
    language: string;
    data: {
        command: {
            'ping': {
                description: string;
            },
            'status': {
                description: string;
            }
            'account': {
                description: string;
                subCommand: {
                    'login': {
                        description: string,
                        options: {
                            'username': string,
                            'password': string,
                        },
                    },
                    'verify': {
                        description: string,
                        options: {
                            'verify_code': string,
                        }
                    },
                    'remove': {
                        description: string,
                    },
                    'get': {
                        description: string,
                    }
                }
            },
        },
    },
}

export {
    type ILanguage
}