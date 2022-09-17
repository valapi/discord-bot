//import

import * as IngCore from '@ing3kth/core';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { ICommandHandler } from "../../../modules";

import { ValorAccount } from '../../../utils/accounts';

//script

const __command: ICommandHandler.File = {
    command: (
        new SlashCommandBuilder()
            .setName('balance')
            .setDescription('Wallet')
    ),
    category: 'valorant',
    echo: {
        data: [
            'wallet'
        ],
    },
    onlyGuild: true,
    async execute({ interaction, language, apiKey }) {
        //load

        const userId = interaction.user.id;

        const { WebClient, ValorantApiCom, isValorAccountFind } = await ValorAccount({
            userId,
            apiKey,
            language: language.name,
        });

        if (isValorAccountFind === false) {
            return {
                content: language.data.command['account']['not_account'],
            };
        }

        //script

        const puuid = WebClient.getSubject();

        const GetWallet = await WebClient.Store.getWallet(puuid);
        const AllWallet = GetWallet.data.Balances;

        const GetCurrency = await ValorantApiCom.Currencies.get();

        // currency
        const BalanceArray: Array<{
            id: string,
            name: string,
            icon: string,
            value: number,
        }> = [];

        if (GetCurrency.isError || !GetCurrency.data.data) {
            return {
                content: language.data.error
            };
        }

        for (const ofCurrency of GetCurrency.data.data) {
            if (!isNaN(AllWallet[ofCurrency.uuid])) {
                BalanceArray.push({
                    id: ofCurrency.uuid,
                    name: ofCurrency.displayName as string,
                    icon: ofCurrency.displayIcon,
                    value: Number(AllWallet[ofCurrency.uuid]),
                });
            }
        }

        // send
        const createEmbed = new EmbedBuilder()
            .setThumbnail((BalanceArray.at(IngCore.Random(0, BalanceArray.length - 1) as number))?.icon as string);

        BalanceArray.forEach((item) => {
            createEmbed.addFields({ name: item.name, value: `${item.value}` });
        });

        //return

        return {
            embeds: [createEmbed],
        };
    },
};

//export

export default __command;