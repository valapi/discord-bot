//common
import { SlashCommandBuilder } from '@discordjs/builders';
import { Permissions, MessageAttachment, MessageEmbed, Formatters, MessageActionRow, MessageButton, MessageSelectMenu } from 'discord.js';
import type { CustomSlashCommands } from '../../../interface/SlashCommand';

//valorant
import ValAccount from '../../../utils/ValAccount';

export default {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Valorant Profile'),
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
            embeds: [createEmbed],
        });
    }
} as CustomSlashCommands;