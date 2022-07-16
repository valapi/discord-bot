import { encrypt, decrypt } from './crypto';
import * as IngCore from '@ing3kth/core';

import {
    ValData,
    type IValorantAccount, ValorantSchema,
} from './database';
import type { ILanguage } from '../language/interface';

import { Client as ApiWrapper } from '@valapi/web-client';
import { Client as ValAPI } from '@valapi/valorant-api.com';
import { Locale, Region } from '@valapi/lib';

async function ValAccount(data: {
    userId: string,
    language?: ILanguage,
    apiKey: string,
    region?: keyof typeof Region.from,
}): Promise<{ __isFind: Boolean, ValApiCom: ValAPI, ValClient: ApiWrapper }> {
    //valorant
    const ValApiCom = new ValAPI({
        language: (data.language?.name || 'en_US').replace('_', '-') as keyof typeof Locale.from,
    });

    //database
    const _cache = new IngCore.Cache('accounts');

    const _save = await _cache.output(data.userId);

    if (!_save) {
        const ValDatabase = await ValData.checkCollection<IValorantAccount>({
            name: 'account',
            schema: ValorantSchema,
            filter: { discordId: data.userId },
        });

        if (ValDatabase.isFind === true) {
            if (ValDatabase.data[1]) {
                const _OnlyOne = ValDatabase.data[0];

                await ValDatabase.model.deleteMany({ discordId: data.userId });

                await new ValDatabase.model({
                    account: _OnlyOne,
                    discordId: data.userId,
                    createdAt: new Date(),
                }).save();
            }

            const ValClient = await ApiWrapper.fromCookie(decrypt(ValDatabase.data[0].account, data.apiKey), { region: data.region || "ap" });

            await _cache.input(encrypt(JSON.stringify(ValClient.toJSON()), data.apiKey), data.userId);

            return {
                __isFind: true,
                ValApiCom,
                ValClient,
            };
        } else {
            return {
                __isFind: false,
                ValApiCom,
                ValClient: new ApiWrapper({ region: data.region || "ap" }),
            };
        }
    } else {
        const ValClient = ApiWrapper.fromJSON(JSON.parse(decrypt(_save, data.apiKey)), { region: data.region || "ap" });
        await ValClient.refresh(false);

        return {
            __isFind: true,
            ValApiCom,
            ValClient,
        };
    }
}

export default ValAccount;