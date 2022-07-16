//common
import { SlashCommandBuilder } from '@discordjs/builders';
import { Permissions, MessageAttachment, MessageEmbed, Formatters, MessageActionRow, MessageButton, MessageSelectMenu } from 'discord.js';
import type { CustomSlashCommands } from '../../../interface/SlashCommand';

//valorant
import ValAccount from '../../../utils/ValAccount';

import { Random } from '@ing3kth/core';

export default {
    data: new SlashCommandBuilder()
        .setName('collection')
        .setDescription('Valorant Items Collection'),
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

        //item
        const GetLoadout = await ValClient.Player.Loadout(puuid);

        const AllGuns: Array<{
            ID: string;
            SkinID: string;
            SkinLevelID: string;
            ChromaID: string;
            CharmInstanceID?: string;
            CharmID?: string;
            CharmLevelID?: string;
            Attachments: Array<any>;
        }> = GetLoadout.data.Guns;
        const AllSprays: Array<{
            EquipSlotID: string;
            SprayID: string;
            SprayLevelID: string | null;
        }> = GetLoadout.data.Sprays;
        const TheIdentity: {
            PlayerCardID: string;
            PlayerTitleID: string;
            AccountLevel: number;
            PreferredLevelBorderID: string;
            HideAccountLevel: boolean;
        } = GetLoadout.data.Identity;
        const ThisIncognito: boolean = GetLoadout.data.Incognito;

        /**
         * script
         */

        let createEmbed: MessageEmbed = new MessageEmbed();

        // Guns //
        let sendGunMessage: string = '';

        for (let ofGun of AllGuns) {
            const GunId = ofGun.SkinID;
            const GetGunData = await ValApiCom.Weapons.getSkinByUuid(GunId);

            if (GetGunData.isError || !GetGunData.data.data) {
                continue;
            }

            const GunName = GetGunData.data.data.displayName;
            sendGunMessage += ` ${GunName}\n`;
        }

        // Sprays //
        let sendSprayMessage: string = '';
        let _DISPLAY: string = '';

        for (let ofTheSpray in AllSprays) {
            const ofSpray = AllSprays[ofTheSpray];

            const SprayID = ofSpray.SprayID;
            const GetSprayData = await ValApiCom.Sprays.getByUuid(SprayID);

            if (GetSprayData.isError || !GetSprayData.data.data) {
                continue;
            }

            const SprayName = GetSprayData.data.data.displayName;
            sendSprayMessage += ` ${SprayName}\n`;

            //extra
            if (_DISPLAY && (Random(0, 2) >= 1)) {
                continue;
            }

            _DISPLAY = GetSprayData.data.data.fullTransparentIcon;
        }
        createEmbed.setThumbnail(_DISPLAY);

        // Identity //

        //card
        const PlayerCardId = TheIdentity.PlayerCardID;
        const GetCardData = await ValApiCom.PlayerCards.getByUuid(PlayerCardId);

        createEmbed.addField('Player Card', `${GetCardData.data.data?.displayName}`, true);
        createEmbed.setImage(GetCardData.data.data?.wideArt as string);

        //title
        const PlayerTitleId = TheIdentity.PlayerTitleID;
        const GetTitleData = await ValApiCom.PlayerTitles.getByUuid(PlayerTitleId);

        if (!GetTitleData.data.data?.titleText) {
            createEmbed.addField('Player Title', `${GetTitleData.data.data?.displayName} - ${GetTitleData.data.data?.titleText}`, true);
        }

        /**
         * sendMessage
         */

        createEmbed
            .setTimestamp(createdTime)
            .setDescription(language.data.command['collection']['default'])
            .addFields(
                { name: '\u200B', value: '\u200B' },
                {
                    name: 'Weapons',
                    value: sendGunMessage,
                    inline: true,
                },
                {
                    name: 'Sprays',
                    value: sendSprayMessage,
                    inline: true,
                },
            )
            .setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}` });

        await interaction.editReply({
            embeds: [createEmbed],
        });

    }
} as CustomSlashCommands;