//common
import { SlashCommandBuilder } from '@discordjs/builders';
import { Permissions, MessageAttachment, MessageEmbed, Formatters, MessageActionRow, MessageButton, MessageSelectMenu } from 'discord.js';
import type { CustomSlashCommands } from '../../../interface/SlashCommand';

//valorant
import ValAccount from '../../../utils/ValAccount';

import { Random } from '@ing3kth/core';

export default {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Valorant InGame Wallet'),
    type: 'valorant',
    echo: {
        command: [
            'wallet'
        ],
    },
    onlyGuild: true,
    async execute({ interaction, language, apiKey, createdTime }) {
        //script
        const userId = interaction.user.id;

        //valorant
        const { ValClient, ValApiCom, __isFind } = await ValAccount({
            userId: userId,
            apiKey: apiKey,
            language: language,
            region: "ap",
        });

        if (__isFind === false) {
            await interaction.editReply({
                content: language.data.command['account']['not_account'],
            });
            return;
        }

        ValClient.on('error', (async (data) => {
            await interaction.editReply({
                content: `${language.data.error} ${Formatters.codeBlock('json', JSON.stringify({ errorCode: data.errorCode, message: data.message }))}`,
            });
        }));

        //success
        const ValorantUserInfo = await ValClient.Player.GetUserInfo();
        const puuid = ValorantUserInfo.data.sub;

        const GetWallet = await ValClient.Store.GetWallet(puuid);
        const AllWallet = GetWallet.data.Balances;

        const GetCurrency = await ValApiCom.Currencies.get();

        //currency
        let BalanceArray: Array<{
            id: string,
            name: string,
            icon: string,
            value: number,
        }> = [];

        if (GetCurrency.isError || !GetCurrency.data.data) {
            throw new Error('Currency not found');
        }

        for (let ofCurrency of GetCurrency.data.data) {
            if (!isNaN(AllWallet[ofCurrency.uuid])) {
                BalanceArray.push({
                    id: ofCurrency.uuid,
                    name: ofCurrency.displayName as string,
                    icon: ofCurrency.displayIcon,
                    value: Number(AllWallet[ofCurrency.uuid]),
                });
            }
        }

        //sendMessage
        const createEmbed = new MessageEmbed()
            .setThumbnail((BalanceArray.at(Random(0, BalanceArray.length - 1) as number))?.icon as string);

        BalanceArray.forEach((item) => {
            createEmbed.addField(item.name, String(item.value));
        });

        await interaction.editReply({
            embeds: [createEmbed],
        });
    }
} as CustomSlashCommands;