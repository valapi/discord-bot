//import

import * as IngCore from '@ing3kth/core';

import { ILanguage } from '../lang';

import { encrypt, decrypt } from './crypto';
import { ValorDatabase, ValorInterface } from './database';

import { Client as WebClient } from '@valapi/web-client';
import { Client as ValorantApiCom } from '@valapi/valorant-api.com';
import { Region } from '@valapi/lib';

//function

async function ValorAccount(config: {
    userId: string,
    apiKey: string,
    region?: keyof typeof Region.from,
    language?: ILanguage.Name,
}): Promise<{ isValorAccountFind: boolean, ValorantApiCom: ValorantApiCom, WebClient: WebClient }> {
    //load

    const MyValorantApiCom = new ValorantApiCom({
        language: config.language || 'en-US',
    });

    const _cache = new IngCore.Cache('accounts');

    //script

    const _save = await _cache.output(config.userId);

    if (!_save) {
        const ValDatabase = await ValorDatabase<ValorInterface.Account.Format>({
            name: 'account',
            schema: ValorInterface.Account.Schema,
            filter: { discordId: config.userId },
        });

        if (ValDatabase.isFind === true) {
            if (ValDatabase.data[1]) {
                const _OnlyOne = ValDatabase.data[0];

                await ValDatabase.model.deleteMany({ discordId: config.userId });

                await (
                    new ValDatabase.model({
                        account: _OnlyOne,
                        discordId: config.userId,
                        createdAt: ValDatabase.data[0].createdAt,
                    })
                ).save();
            }

            const MyWebClient = await WebClient.fromCookie(decrypt(ValDatabase.data[0].account, config.apiKey), { region: config.region || "ap" });

            _cache.input(encrypt(JSON.stringify(MyWebClient.toJSON()), config.apiKey), config.userId);

            return {
                isValorAccountFind: true,
                ValorantApiCom: MyValorantApiCom,
                WebClient: MyWebClient,
            };
        } else {
            return {
                isValorAccountFind: false,
                ValorantApiCom: MyValorantApiCom,
                WebClient: new WebClient({ region: config.region || "ap" }),
            };
        }
    } else {
        const MyWebClient = WebClient.fromJSON(JSON.parse(decrypt(_save, config.apiKey)), { region: config.region || "ap" });
        await MyWebClient.refresh(false);

        return {
            isValorAccountFind: true,
            ValorantApiCom: MyValorantApiCom,
            WebClient: MyWebClient,
        };
    }
}

//export

export {
    ValorAccount
};