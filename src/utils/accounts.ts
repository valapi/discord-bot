// import

import * as IngCore from "@ing3kth/core";

import { ILanguage } from "../lang";

import { encrypt, decrypt } from "./crypto";
import { ValorDatabase, ValorInterface } from "./database";

import { WebClient } from "@valapi/web-client";
import { ValorantApiCom } from "@valapi/valorant-api.com";

// function

async function ValorAccount(config: {
    userId: string;
    apiKey: string;
    language?: ILanguage.Name;
}): Promise<{
    isValorAccountFind: boolean;
    ValorantApiCom: ValorantApiCom;
    WebClient: WebClient;
}> {
    // load

    const MyValorantApiCom = new ValorantApiCom({
        language: config.language || "en-US"
    });

    const _cache = new IngCore.BasicTemp("accounts");

    // script

    const _save = await _cache.get(config.userId);

    if (!_save) {
        const ValDatabase = await ValorDatabase<ValorInterface.Account.Format>({
            name: "account",
            schema: ValorInterface.Account.Schema,
            filter: {
                discordId: config.userId
            }
        });

        if (ValDatabase.isFind === true) {
            const _OnlyOne = ValDatabase.data[0];

            if (ValDatabase.data[1]) {
                await ValDatabase.model.deleteMany({
                    discordId: config.userId
                });

                await new ValDatabase.model({
                    account: _OnlyOne.account,
                    region: _OnlyOne.region,
                    discordId: config.userId,
                    createdAt: _OnlyOne.createdAt
                }).save();
            }

            const MyWebClient = await WebClient.fromCookie(
                decrypt(_OnlyOne.account, config.apiKey),
                {
                    region: _OnlyOne.region
                }
            );

            _cache.add(
                encrypt(JSON.stringify(MyWebClient.toJSON()), config.apiKey),
                config.userId
            );

            return {
                isValorAccountFind: true,
                ValorantApiCom: MyValorantApiCom,
                WebClient: MyWebClient
            };
        } else {
            return {
                isValorAccountFind: false,
                ValorantApiCom: MyValorantApiCom,
                WebClient: new WebClient()
            };
        }
    } else {
        const MyWebClient = WebClient.fromJSON(JSON.parse(decrypt(_save, config.apiKey)));
        await MyWebClient.refresh();

        return {
            isValorAccountFind: true,
            ValorantApiCom: MyValorantApiCom,
            WebClient: MyWebClient
        };
    }
}

// export

export { ValorAccount };
