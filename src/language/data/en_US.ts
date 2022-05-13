import { ILanguage } from "../controller";

export default {
    language: 'en_US',
    data: {
        command: {
            'ping': {
                description: 'Pong!',
            },
            'status': {
                description: 'check the current status of the bot',
            },
            'account': {
                description: 'Valorant account management',
                subCommand: {
                    'login': {
                        description: 'add your Valorant account',
                        options: {
                            'username': 'Riot account username',
                            'password': 'Riot account password',
                        },
                    },
                    'verify': {
                        description: 'verify your Valorant account',
                        options: {
                            'verify_code': 'verify code',
                        }
                    },
                    'remove': {
                        description: 'remove your Valorant account',
                    },
                    'get': {
                        description: 'get your Valorant account',
                    },
                },
            },
        },
    },
} as ILanguage;