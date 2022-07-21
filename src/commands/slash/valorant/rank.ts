//common
import { SlashCommandBuilder } from '@discordjs/builders';
import { Permissions, MessageAttachment, MessageEmbed, Formatters, MessageActionRow, MessageButton, MessageSelectMenu } from 'discord.js';
import type { CustomSlashCommands } from '../../../interface/SlashCommand';

//valorant
import ValAccount from '../../../utils/ValAccount';

export default {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Valorant Competitive Rank'),
    type: 'valorant',
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

        const ThisRank = (((await ValClient.MMR.FetchCompetitiveUpdates(puuid)).data.Matches as Array<any>).filter(match => Number(match.RankedRatingEarned) !== 0)).at(0);

        let Rank_Rating_Now: string = ThisRank.RankedRatingAfterUpdate;

        const AllRanks = await ValApiCom.CompetitiveTiers.get();
        if (AllRanks.isError || !AllRanks.data.data) throw new Error(AllRanks.data.error);

        let Rank_Name: string = '';
        let Rank_Icon: string = '';
        let Rank_Color: string = '';

        for (let _rank of AllRanks.data.data) {
            for (let _tier of _rank.tiers) {
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

        interaction.editReply({
            embeds: [
                new MessageEmbed()
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
            ]
        });
    }
} as CustomSlashCommands;