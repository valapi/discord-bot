//import

import * as IngCore from '@ing3kth/core';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { ICommandHandler } from "../../../modules";

import { ValorAccount } from '../../../utils/accounts';

//script

const __command: ICommandHandler.File = {
    command: (
        new SlashCommandBuilder()
            .setName('collection')
            .setDescription('Items Collection')
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

        const GetLoadout = await WebClient.Player.loadout(puuid);

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
        //const ThisIncognito: boolean = GetLoadout.data.Incognito;

        const createEmbed: EmbedBuilder = new EmbedBuilder();

        // Guns //
        let sendGunMessage = '';

        for (const ofGun of AllGuns) {
            const GunId = ofGun.SkinID;
            const GetGunData = await ValorantApiCom.Weapons.getSkinByUuid(GunId);

            if (GetGunData.isError || !GetGunData.data.data) {
                continue;
            }

            const GunName = GetGunData.data.data.displayName;
            sendGunMessage += ` ${GunName}\n`;
        }

        // Sprays //
        let sendSprayMessage = '';
        let _DISPLAY = '';

        for (const ofTheSpray in AllSprays) {
            const ofSpray = AllSprays[ofTheSpray];

            const SprayID = ofSpray.SprayID;
            const GetSprayData = await ValorantApiCom.Sprays.getByUuid(SprayID);

            if (GetSprayData.isError || !GetSprayData.data.data) {
                continue;
            }

            const SprayName = GetSprayData.data.data.displayName;
            sendSprayMessage += ` ${SprayName}\n`;

            //extra
            if (_DISPLAY && (IngCore.Random(0, 2) >= 1)) {
                continue;
            }

            _DISPLAY = GetSprayData.data.data.fullTransparentIcon;
        }
        createEmbed.setThumbnail(_DISPLAY);

        // Identity //

        // card
        const PlayerCardId = TheIdentity.PlayerCardID;
        const GetCardData = await ValorantApiCom.PlayerCards.getByUuid(PlayerCardId);

        createEmbed.addFields({ name: 'Player Card', value: `${GetCardData.data.data?.displayName}`, inline: true });
        createEmbed.setImage(GetCardData.data.data?.wideArt as string);

        // title
        const PlayerTitleId = TheIdentity.PlayerTitleID;
        const GetTitleData = await ValorantApiCom.PlayerTitles.getByUuid(PlayerTitleId);

        if (!GetTitleData.data.data?.titleText) {
            createEmbed.addFields({ name: 'Player Title', value: `${GetTitleData.data.data?.displayName} - ${GetTitleData.data.data?.titleText}`, inline: true });
        }

        // send

        createEmbed
            .setTimestamp(createdTime)
            .setDescription(language.data.command['collection']['default'])
            .addFields(
                { name: '\u200B', value: '\u200B' },
                {
                    name: 'Weapons',
                    value: `${sendGunMessage}`,
                    inline: true,
                },
                {
                    name: 'Sprays',
                    value: `${sendSprayMessage}`,
                    inline: true,
                },
            )
            .setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}` });

        //return

        return {
            embeds: [createEmbed],
        };
    },
};

//export

export default __command;