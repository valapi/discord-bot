"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const accounts_1 = require("../../../utils/accounts");
const lib_1 = require("@valapi/lib");
const __command = {
    command: (new discord_js_1.SlashCommandBuilder()
        .setName('profile')
        .setDescription('My Profile')),
    category: 'valorant',
    onlyGuild: true,
    async execute({ interaction, language, apiKey, createdTime }) {
        const userId = interaction.user.id;
        const { WebClient, ValorantApiCom, isValorAccountFind } = await (0, accounts_1.ValorAccount)({
            userId,
            apiKey,
            language: language.name,
        });
        if (isValorAccountFind === false) {
            return {
                content: language.data.command['account']['not_account'],
            };
        }
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
        return {
            content: language.data.command['profile']['default'],
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setColor(`#0099ff`)
                    .addFields({ name: `Name`, value: `${ValorantUserInfo.data.acct.game_name}`, inline: true }, { name: `Tag`, value: `${ValorantUserInfo.data.acct.tag_line}`, inline: true }, { name: '\u200B', value: '\u200B' }, { name: `Region`, value: `${lib_1.Region.fromString(JsonWebClient.region.live).replace('_', ' ')}`, inline: true }, { name: `Create`, value: (0, discord_js_1.time)(new Date(ValorantUserInfo.data.acct.created_at)), inline: true }, { name: '\u200B', value: '\u200B' }, { name: `Card`, value: `${PlayerCard_Name}`, inline: true }, { name: `Title`, value: `${PlayerTitle_Title}`, inline: true })
                    .setThumbnail(PlayerCard_Icon)
                    .setTimestamp(createdTime)
                    .setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}` }),
            ],
        };
    },
};
exports.default = __command;
