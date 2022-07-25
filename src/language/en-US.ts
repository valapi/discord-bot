//import

import type { ILanguage } from '../lang';

//script

const _language: ILanguage.File = {
    name: `en-US`,
    data: {
        "not_guild": `This command can only be used in a guild.`,
        "not_permission": `You don't have permission to use this command.`,
        "dev_cmd": `This command is not available for use.`,
        "error": `Something Went Wrong, Please Try Again Later`,
        command: {
            ping: {
                "default": `Pong!`,
            },
            account: {
                "succes": `You Are Register Riot Account With`,
                "not_account": `Couldn't Find Your Account`,
                "verify": `Please Verify Your Account\nBy Using: **/verify {VerifyCode}**`,
                "remove": `Your Account Has Been Removed`,
                "reconnect": `Reconnected !`,
            },
            language: {
                "fail": `Language Not Found`,
                "succes": `Language Changed`,
            },
            profile: {
                "default": `This is your Valorant profiles`,
            },
            store: {
                "not_nightmarket": `Bonus Store is undefined`,
                "no_nightmarket": `You didn't open any night market items yet.`,
            },
            report: {
                "thanks": `Thank you for your report!`,
                "topic_title": `Topic`,
                "topic_placeholder": `Your Topic (required)`,
                "message_title": `Report Message`,
                "message_placeholder": `Your Report Message (required)\nsometime you need to report again to submit`,
            },
            collection: {
                "default": `This is your Valorant collection`,
            },
            party: {
                "not_party": `You are not in-game.`,
            },
            help: {
                "select_category": `You can select one of the categories below`,
                "not_category": `No command in this category`,
                "placeholder": `Select Command Type`,
                "type_settings": `Change Settings`,
                "type_infomation": `Show Infomations`,
                "type_valorant": `VALORANT In-game Info`,
                "type_miscellaneous": `Other Commands`,
            },
            match: {
                "not_match": `No match history was found.`,
            },
        },
    },
};

//export

export default _language;