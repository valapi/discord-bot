//import

import * as IngCore from '@ing3kth/core';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { ICommandHandler } from "../../../modules";

import { Region } from 'valorant.ts';
import { ValorAccount } from '../../../utils/accounts';

//script

const __command: ICommandHandler.File = {
    command: (
        new SlashCommandBuilder()
            .setName('rank')
            .setDescription('Competitive Rank')
    ),
    category: 'valorant',
    onlyGuild: true,
    async execute({ interaction, language, apiKey, createdTime }) {
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

        const ThisRank = (((await WebClient.MMR.FetchCompetitiveUpdates(puuid)).data.Matches as Array<any>).filter(match => Number(match.RankedRatingEarned) !== 0)).at(0);

        const Rank_Rating_Now: string = ThisRank.RankedRatingAfterUpdate;

        const AllRanks = await ValorantApiCom.CompetitiveTiers.get();
        if (AllRanks.isError || !AllRanks.data.data) throw new Error(AllRanks.data.error);

        let Rank_Name = '';
        let Rank_Icon = '';
        let Rank_Color = '';

        for (const _rank of AllRanks.data.data) {
            for (const _tier of _rank.tiers) {
                if (_tier.tier == ThisRank.TierAfterUpdate) {
                    Rank_Name = _tier.tierName as string;
                    Rank_Icon = _tier.largeIcon;
                    Rank_Color = String(_tier.backgroundColor).substring(0, _tier.backgroundColor.length - 2);
                    break;
                }
            }

            if (Rank_Name) {
                break;
            }
        }

        //return

        return {
            embeds: [
                new EmbedBuilder()
                    .setColor(`#${Rank_Color}`)
                    .setTimestamp(createdTime)
                    .addFields(
                        {
                            name: "Rank",
                            value: `${Rank_Name}`,
                        },
                        { name: '\u200B', value: '\u200B' },
                        {
                            name: "Rating",
                            value: `${Rank_Rating_Now} RR`,
                        },
                    )
                    .setThumbnail(Rank_Icon),
            ],
        };
    },
};

//export

export default __command;