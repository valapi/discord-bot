import type { ILanguage } from "../interface";

export default {
    name: `en_US`,
    data: {
        error: `Something Went Wrong, Please Try Again Later`,
        command: {
            "ping": {
                "default": `Pong!`,
            },
            "account": {
                "succes": `You Are Register Riot Account With`,
                "not_account": `Couldn't Find Your Account`,
                "verify": `Please Verify Your Account\nBy Using: **/login verify {VerifyCode}**`,
                "remove": `Your Account Has Been Removed`,
            },
            "language": {
                "fail": `Language Not Found`,
                "succes": `Language Changed`,
            },
            "profile": {
                "default": `This is your Valorant profiles`,
            }
        },
    },
} as ILanguage;