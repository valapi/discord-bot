//common
import { SlashCommandBuilder } from '@discordjs/builders';
import { Permissions, MessageAttachment, MessageEmbed, Formatters, MessageActionRow, MessageButton, MessageSelectMenu } from 'discord.js';
import type { CustomSlashCommands } from '../../../interface/SlashCommand';

//valorant common
import { decrypt } from '../../../utils/crypto';
import { ValData, type IValorantAccount, ValorantSchema } from '../../../utils/database';

//valorant
import { Region } from 'valorant.ts';
import { Client as ApiWrapper } from '@valapi/web-client';
import { Client as ValAPI } from '@valapi/valorant-api.com';
import { Locale } from '@valapi/lib';

export default {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Valorant Profile'),
    type: 'valorant',
    onlyGuild: true,
    async execute({ interaction, language, apiKey, createdTime }) {
        //script
        const userId = interaction.user.id;

        const ValDatabase = await ValData.checkCollection<IValorantAccount>({
            name: 'account',
            schema: ValorantSchema,
            filter: { discordId: interaction.user.id },
        });

        //valorant
        const ValApiCom = new ValAPI({
            language: (language.name).replace('_', '-') as keyof typeof Locale.from,
        });

        if (ValDatabase.isFind === false) {
            await interaction.editReply({
                content: language.data.command['account']['not_account'],
            });
            return;
        }
        
        const ValClient = ApiWrapper.fromJSON(JSON.parse(decrypt((ValDatabase.once as IValorantAccount).account, apiKey)), {
            region: Region.Asia_Pacific
        });

        ValClient.on('error', (async (data) => {
            await interaction.editReply({
                content: `${language.data.error} ${Formatters.codeBlock('json', JSON.stringify({ errorCode: data.errorCode, message: data.message }))}`,
            });
        }));

        await ValClient.refresh(false);

        //success
        const ValorantUserInfo = await ValClient.Player.GetUserInfo();
        const puuid = ValorantUserInfo.data.sub;
        
        const ValorantInventory = await ValClient.Player.Loadout(puuid);

        const PlayerCard_ID = ValorantInventory.data.Identity.PlayerCardID;
        const PlayerCard = await ValApiCom.PlayerCards.getByUuid(PlayerCard_ID);
        const PlayerCard_Name = String(PlayerCard.data.data?.displayName);
        const PlayerCard_Icon = String(PlayerCard.data.data?.displayIcon);

        const PlayerTitle_ID = ValorantInventory.data.Identity.PlayerTitleID;
        const PlayerTitle = await ValApiCom.PlayerTitles.getByUuid(PlayerTitle_ID);
        const PlayerTitle_Title = String(PlayerTitle.data.data?.titleText);

        //sendMessage
        const createEmbed = new MessageEmbed()
            .setColor(`#0099ff`)
            .addFields(
                { name: `Name`, value: `${ValorantUserInfo.data.acct.game_name}`, inline: true },
                { name: `Tag`, value: `${ValorantUserInfo.data.acct.tag_line}`, inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: `Card`, value: `${PlayerCard_Name}`, inline: true },
                { name: `Title`, value: `${PlayerTitle_Title}`, inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: `Country`, value: `${ValorantUserInfo.data.country}`, inline: true },
                { name: `Create`, value: `${new Date(ValorantUserInfo.data.acct.created_at).toUTCString()}`, inline: true },
            )
            .setThumbnail(PlayerCard_Icon)
            .setTimestamp(createdTime)
            .setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}` });

        await interaction.editReply({
            content: language.data.command['profile']['default'],
            embeds: [ createEmbed ],
        });
    }
} as CustomSlashCommands;