//common
import { SlashCommandBuilder } from '@discordjs/builders';
import { Permissions, MessageAttachment, MessageEmbed, Formatters, MessageActionRow, MessageButton, MessageSelectMenu } from 'discord.js';
import type { CustomSlashCommands } from '../../../interface/SlashCommand';

//valorant
import ValAccount from '../../../utils/ValAccount';

const _CurrentBattlePassContractId = '99ac9283-4dd3-5248-2e01-8baf778affb4';

export default {
    data: new SlashCommandBuilder()
        .setName('battlepass')
        .setDescription('Valorant Battle Pass'),
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

        const AllContracts: Array<{
            ContractDefinitionID: string;
            ContractProgression?: {
                TotalProgressionEarned: number;
                HighestRewardedLevel: {
                    [key: string]: number;
                };
            };
            ProgressionLevelReached: number;
            ProgressionTowardsNextLevel: number;
        }> = (await ValClient.Contract.Fetch(puuid)).data.Contracts;

        const BattlePassContract = AllContracts.find((item) => item.ContractDefinitionID === _CurrentBattlePassContractId);

        let BP_Id = BattlePassContract?.ContractDefinitionID;
        let BP_CurrentLevel = Number(BattlePassContract?.ProgressionLevelReached);
        let BP_XpAtNow = BattlePassContract?.ProgressionTowardsNextLevel;
        let BP_TotalEarnedXp = BattlePassContract?.ContractProgression?.TotalProgressionEarned;

        const TheBattlePass = await ValApiCom.Contracts.getByUuid(BP_Id as string);

        let BP_Name = TheBattlePass.data.data?.displayName;

        //slot
        let _ofSlot = BP_CurrentLevel % 5;
        let _Slot: number = 0;

        for (let i = 0; i < Number(TheBattlePass.data.data?.content.chapters.length); i++) {
            if ((i * 5) + _ofSlot === BP_CurrentLevel) {
                _Slot = i;
                break;
            }
        }

        let BP_CurrentSlot = TheBattlePass.data.data?.content.chapters[_Slot];
        let BP_LevelSlot = BP_CurrentSlot?.levels[_ofSlot];

        //slot data
        let BP_Slot_ID = BP_LevelSlot?.reward.uuid as string;
        let BP_Slot_XpNeed = BP_LevelSlot?.xp;

        let BP_Slot_Name = ``;
        let BP_Slot_Description = ``;
        let BP_Slot_Display = ``;

        switch (BP_LevelSlot?.reward.type) {
            case 'EquippableSkinLevel': //weapon skin
                const SlotData_0 = await ValApiCom.Weapons.getSkinLevelByUuid(BP_Slot_ID);
                if (SlotData_0.isError || !SlotData_0.data.data) throw new Error('Data 0 Not Found!');
                BP_Slot_Name = SlotData_0.data.data.displayName as string;
                BP_Slot_Display = SlotData_0.data.data.displayIcon;
                break;
            case 'EquippableCharmLevel': //buddy
                const SlotData_1 = await ValApiCom.Buddies.getLevelByUuid(BP_Slot_ID);
                if (SlotData_1.isError || !SlotData_1.data.data) throw new Error('Data 1 Not Found!');
                BP_Slot_Name = SlotData_1.data.data.displayName as string;
                BP_Slot_Display = SlotData_1.data.data.displayIcon;
                break;
            case 'Currency':
                const SlotData_2 = await ValApiCom.Currencies.getByUuid(BP_Slot_ID);
                if (SlotData_2.isError || !SlotData_2.data.data) throw new Error('Data 2 Not Found!');
                BP_Slot_Name = SlotData_2.data.data.displayName as string;
                BP_Slot_Display = SlotData_2.data.data.displayIcon;
                break;
            case 'PlayerCard':
                const SlotData_3 = await ValApiCom.PlayerCards.getByUuid(BP_Slot_ID);
                if (SlotData_3.isError || !SlotData_3.data.data) throw new Error('Data 3 Not Found!');
                BP_Slot_Name = SlotData_3.data.data.displayName as string;
                BP_Slot_Display = SlotData_3.data.data.displayIcon;
                break;
            case 'Spray':
                const SlotData_4 = await ValApiCom.Sprays.getByUuid(BP_Slot_ID);
                if (SlotData_4.isError || !SlotData_4.data.data) throw new Error('Data 4 Not Found!');
                BP_Slot_Name = SlotData_4.data.data.displayName as string;
                BP_Slot_Display = SlotData_4.data.data.displayIcon;
                break;
            case 'Title':
                const SlotData_5 = await ValApiCom.PlayerTitles.getByUuid(BP_Slot_ID);
                if (SlotData_5.isError || !SlotData_5.data.data) throw new Error('Data 5 Not Found!');
                BP_Slot_Name = SlotData_5.data.data.displayName as string;
                BP_Slot_Description = SlotData_5.data.data.titleText as string;
                break;
            default:
                throw new Error('Type of slot Not Found!');
        }

        let ShowSlot = `${_Slot + 1}`;
        if(_Slot >= 11) ShowSlot = 'Epilogue';

        const createEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTimestamp(createdTime)
            .addFields(
                { name: '\u200B', value: '\u200B' },
                {
                    name: 'Level',
                    value: `${BP_CurrentLevel + 1}`,
                    inline: true,
                },
                {
                    name: 'Chapter',
                    value: `${ShowSlot}`,
                    inline: true,
                },
                {
                    name: 'Name',
                    value: `${BP_Slot_Name}`,
                    inline: true,
                },
                { name: '\u200B', value: '\u200B' },
                {
                    name: 'XP (level)',
                    value: `**${BP_XpAtNow}** */* ${BP_Slot_XpNeed}`,
                    inline: true,
                },
                {
                    name: 'XP (total)',
                    value: `${BP_TotalEarnedXp}`,
                    inline: true,
                },
                { name: '\u200B', value: '\u200B' },
            )
            .setAuthor({ name: `${BP_Name}` })
            .setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}` });

        if (BP_Slot_Display) createEmbed.setThumbnail(BP_Slot_Display);
        if (BP_Slot_Description) createEmbed.setDescription(BP_Slot_Description);

        await interaction.editReply({
            embeds: [createEmbed],
        });
    }
} as CustomSlashCommands;