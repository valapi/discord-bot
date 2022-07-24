//import

import * as IngCore from '@ing3kth/core';
import { SlashCommandBuilder, EmbedBuilder, time } from 'discord.js';
import type { ICommandHandler } from "../../../modules";

import { Region } from 'valorant.ts';
import { ValorAccount } from '../../../utils/accounts';

import { Region as _Region } from '@valapi/lib';

//script

const __command: ICommandHandler.File = {
    command: (
        new SlashCommandBuilder()
            .setName('profile')
            .setDescription('My Profile')
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
            region: Region.Asia_Pacific,
        });

        if (isValorAccountFind === false) {
            return {
                content: language.data.command['account']['not_account'],
            };
        }

        //script

        const ValorantUserInfo = await WebClient.Player.GetUserInfo();
        const puuid = ValorantUserInfo.data.sub;

        const ValorantInventory = await WebClient.Player.Loadout(puuid);

        const PlayerCard_ID = ValorantInventory.data.Identity.PlayerCardID;
        const PlayerCard = await ValorantApiCom.PlayerCards.getByUuid(PlayerCard_ID);
        const PlayerCard_Name = String(PlayerCard.data.data?.displayName);
        const PlayerCard_Icon = String(PlayerCard.data.data?.displayIcon);

        const PlayerTitle_ID = ValorantInventory.data.Identity.PlayerTitleID;
        const PlayerTitle = await ValorantApiCom.PlayerTitles.getByUuid(PlayerTitle_ID);
        const PlayerTitle_Title = String(PlayerTitle.data.data?.titleText);

        const JsonWebClient = WebClient.toJSON();

        //return

        return {
            content: language.data.command['profile']['default'],
            embeds: [
                new EmbedBuilder()
                    .setColor(`#0099ff`)
                    .addFields(
                        { name: `Name`, value: `${ValorantUserInfo.data.acct.game_name}`, inline: true },
                        { name: `Tag`, value: `${ValorantUserInfo.data.acct.tag_line}`, inline: true },
                        { name: '\u200B', value: '\u200B' },
                        { name: `Region`, value: `${_Region.fromString(JsonWebClient.region.live as "ap").replace('_', ' ')}`, inline: true },
                        { name: `Create`, value: time(new Date(ValorantUserInfo.data.acct.created_at)), inline: true },
                        { name: '\u200B', value: '\u200B' },
                        { name: `Card`, value: `${PlayerCard_Name}`, inline: true },
                        { name: `Title`, value: `${PlayerTitle_Title}`, inline: true },
                    )
                    .setThumbnail(PlayerCard_Icon)
                    .setTimestamp(createdTime)
                    .setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}` }),
            ],
        };
    },
}

//export

export default __command;